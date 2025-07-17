const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Address = require('../models/Address');
const User = require('../models/User');
const Product = require('../models/Product');
const CartItem = require('../models/CartItem');
const { generateInvoicePDFBuffer } = require('../utils/generateInvoice');
const { uploadPDFBufferToCloudinary } = require('../utils/cloudinaryUpload');
const transporter = require('../config/mailer');
const { generateEmailHTML } = require('../utils/generateEmailHTML');
const axios = require('axios');
const { sendStockAlertEmail } = require('../utils/sendStockAlertEmail');

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Send WhatsApp message
const sendWhatsAppMessage = async (mobile, orderId, amount, paymentMethod, items, deliveryDate, userName) => {
  if (!mobile || typeof mobile !== 'string' || mobile.trim() === '') {
    console.warn('Invalid or missing mobile number for WhatsApp message');
    return;
  }
  try {
    // Ensure phone number is in international format
    let phoneNumber = mobile.trim();
    if (!phoneNumber.startsWith('+')) {
      phoneNumber = `+91${phoneNumber}`; // Default to India (+91); adjust if supporting other countries
    }
    console.log(`Formatted phone number: ${phoneNumber}`);

    // Prepare items summary (e.g., "Item1 (2), Item2 (1)")
    const itemsSummary = items.map(item => `${item.product.name} (${item.quantity})`).join(', ');

    const message = {
      messaging_product: 'whatsapp',
      to: phoneNumber,
      type: 'template',
      template: {
        name: 'order_confirmed_panisho', // Must be an approved template
        language: { code: 'en' },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: userName || 'Customer' }, // {{1}} - Name
              { type: 'text', text: orderId },                 // {{2}} - Order ID
              { type: 'text', text: `₹${amount.toLocaleString()}` }, // {{3}} - Amount
              { type: 'text', text: paymentMethod || 'Unknown' },    // {{4}} - Payment Method
              { type: 'text', text: itemsSummary || 'N/A' },         // {{5}} - Items
              { type: 'text', text: deliveryDate || 'TBD' }          // {{6}} - Expected Delivery
            ]
          }
        ]
      }
    };

    await axios.post(
      `https://graph.facebook.com/v20.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
      message,
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(`WhatsApp message sent to ${phoneNumber} for order ${orderId}`);
  } catch (error) {
    console.error('WhatsApp message error:', {
      error: error.message,
      response: error.response?.data,
      mobile,
      orderId
    });
  }
};

// Place Order after success or for COD
exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId, paymentMethod, subtotal: clientSubtotal, shipping: clientShipping, total: clientTotal } = req.body;
    const { coupon } = req.body;
    console.log('📦 Place Order Request:', {
      userId,
      addressId,
      paymentMethod,
      clientSubtotal,
      clientShipping,
      clientTotal,
      coupon
    });

    const user = await User.findById(userId).select('firstName lastName  mobile email');
    const address = await Address.findById(addressId);
    const cartItems = await CartItem.find({ userId }).populate('productId');

    if (!user || !address || cartItems.length === 0) {
      return res.status(400).json({ message: 'User, address, or cart data missing' });
    }

    const calculatedSubtotal = cartItems.reduce((sum, item) => {
      const price = item.variant?.sellingPrice || 0;
      return sum + price * item.quantity;
    }, 0);

    const calculatedShipping = calculatedSubtotal > 499 ? 0 : 49;
    const calculatedTotal = calculatedSubtotal + calculatedShipping;

    const isValid = (val) => typeof val === 'number' && !isNaN(val);

    let discountAmount = 0;
    let finalSubtotal = Math.round(isValid(clientSubtotal) ? clientSubtotal : calculatedSubtotal);
    let finalShipping = Math.round(isValid(clientShipping) ? clientShipping : calculatedShipping);
    let finalTotal = finalSubtotal + finalShipping;

    if (coupon && coupon.discountAmount) {
      discountAmount = Math.round(coupon.discountAmount);
      finalTotal = finalTotal - discountAmount;
    }
    finalTotal = Math.round(finalTotal);


    if (Math.abs(finalTotal - calculatedTotal) > 1) {
      console.warn('⚠️ Frontend total mismatch with backend:', {
        client: finalTotal,
        expected: calculatedTotal
      });
    }

    // ✅ Decrement stock for each item
    for (const item of cartItems) {
      const product = item.productId;
      const variantIndex = product.variants.findIndex(v => v.sku === item.variant.sku);

      if (variantIndex === -1) {
        return res.status(400).json({ message: `Variant not found for product ${product.name}` });
      }

      const variant = product.variants[variantIndex];

      if (variant.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name} (${variant.volume}${variant.volumeUnit})`
        });
      }

      variant.stock -= item.quantity;
      product.variants[variantIndex] = variant;
      await product.save();

      // ✅ Send stock alert if below threshold
      const threshold = parseInt(process.env.STOCK_ALERT_THRESHOLD || '5', 10);
      if (variant.stock < threshold) {
        await sendStockAlertEmail(product.name, variant, variant.stock);
      }

    }

    // ✅ Create the order
    const order = await Order.create({
      userId,
      addressId,
      paymentMethod,
      subtotal: finalSubtotal,
      shipping: finalShipping,
      total: finalTotal,
      discount: discountAmount, // ✅ Store discount
      coupon: req.body.coupon && req.body.coupon.code ? {
        code: req.body.coupon.code,
        discountAmount: req.body.coupon.discountAmount || 0
      } : null,
      paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Paid',
      items: cartItems.map(item => ({
        productId: item.productId._id,
        variant: item.variant,
        quantity: item.quantity
      })),

    });

    console.log('✅ Order created:', order._id);
    console.log('🎟️ Coupon applied in order:', order.coupon);

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    const formattedDelivery = deliveryDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const itemsWithDetails = cartItems.map(item => ({
      product: item.productId,
      variant: item.variant, // Ensure full variant with sellingPrice
      quantity: item.quantity
    }));

    // ✅ Send WhatsApp confirmation
    if (user.mobile && typeof user.mobile === 'string') {
      const mobile = user.mobile.startsWith('+') ? user.mobile : `+91${user.mobile}`;
      try {
        await sendWhatsAppMessage(
          mobile,
          order._id,
          finalTotal,
          paymentMethod,
          itemsWithDetails,
          formattedDelivery,
          user.firstName
        );
      } catch (err) {
        console.warn("❗ WhatsApp message failed:", err?.response?.data || err.message);
      }
    }

    // ✅ Generate and upload invoice
    const pdfBuffer = await generateInvoicePDFBuffer({
      ...order.toObject(),
      user,
      address,
      items: itemsWithDetails
    });

    const invoiceUrl = await uploadPDFBufferToCloudinary(pdfBuffer, `invoice-${order._id}`);
    order.invoiceUrl = invoiceUrl;
    await order.save();


    // Set payment status: 'Paid' if Razorpay, else 'Pending'
    order.paymentStatus = paymentMethod === 'cod' ? 'Pending' : 'Paid';


    // ✅ Send email invoice
    await transporter.sendMail({
      from: `"Panisho" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: '🧾 Your Panisho Order Invoice',
      html: generateEmailHTML({
        order: { ...order.toObject(), items: itemsWithDetails },
        user,
        address
      }),
      attachments: [
        {
          filename: `invoice-${order._id}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    });

    // ✅ Clear cart
    await CartItem.deleteMany({ userId });

    res.status(201).json({
      message: 'Order placed successfully',
      orderId: order._id,
      invoiceUrl
    });

  } catch (err) {
    console.error('❌ PlaceOrder Error:', err);
    res.status(500).json({ message: 'Something went wrong while placing the order' });
  }
};

exports.placeBuyNowOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId, paymentMethod, cart, subtotal, shipping, total, coupon } = req.body;

    if (!userId || !addressId || !cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ message: 'Missing required fields for Buy Now' });
    }

    const user = await User.findById(userId);
    const address = await Address.findById(addressId);

    if (!user || !address) {
      return res.status(400).json({ message: 'Invalid user or address' });
    }

    const itemsWithDetails = await Promise.all(cart.map(async item => {
      const product = await Product.findById(item.productId);
      return {
        product,
        variant: item.variant,
        quantity: item.quantity
      };
    }));

    // Calculate total as you already do...
    const discountAmount = coupon?.discountAmount || 0;
    const finalSubtotal = subtotal;
    const finalShipping = shipping;
    const finalTotal = Math.round(subtotal + shipping - discountAmount);

    // Validate stock and update
    for (const item of itemsWithDetails) {
      const product = item.product;
      const variantIndex = product.variants.findIndex(v => v.sku === item.variant.sku);
      if (variantIndex === -1) {
        return res.status(400).json({ message: `Variant not found for ${product.name}` });
      }

      const stock = product.variants[variantIndex].stock;
      if (stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      variant.stock -= item.quantity;
      product.variants[variantIndex] = variant;
      await product.save();

      // ✅ Send stock alert if below threshold
      const threshold = parseInt(process.env.STOCK_ALERT_THRESHOLD || '5', 10);
      if (variant.stock < threshold) {
        await sendStockAlertEmail(product.name, variant, variant.stock);
      }

    }

    const order = await Order.create({
      userId,
      addressId,
      paymentMethod,
      subtotal: finalSubtotal,
      shipping: finalShipping,
      total: finalTotal,
      discount: discountAmount,
      coupon: coupon?.code ? {
        code: coupon.code,
        discountAmount
      } : null,
      paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Paid',
      items: cart.map(item => ({
        productId: item.productId,
        variant: item.variant,
        quantity: item.quantity
      }))
    });

    res.status(201).json({ message: 'Buy Now order placed successfully', orderId: order._id });
  } catch (err) {
    console.error('❌ Buy Now Order Error:', err);
    res.status(500).json({ message: 'Error placing Buy Now order' });
  }
};



// Create Razorpay Order
exports.createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100, // ₹ to paise
      currency: 'INR',
      receipt: `rcpt_${Math.floor(Math.random() * 100000)}`,
    };

    const order = await razorpayInstance.orders.create(options);
    res.json({ razorpayOrderId: order.id });

  } catch (error) {
    console.error("Razorpay order error:", error);
    res.status(500).json({ message: "Failed to create Razorpay order" });
  }
};

// Verify Razorpay Payment
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      addressId,
      paymentMethod,
      cart,
      subtotal,
      shipping,
      total,
      coupon,
      isBuyNow  // ✅ custom flag from frontend
    } = req.body;

    // Validate Razorpay fields
    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing Razorpay payment details' });
    }

    // Validate order fields
    if (!addressId || !paymentMethod || !cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ message: 'Missing required order details' });
    }

    console.log('✅ Verifying Razorpay payment:', {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    });

    // Signature verification
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generated_signature = hmac.digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment verification failed: Invalid signature' });
    }

    // ✅ Verified — now place order based on flow
    req.body = {
      addressId,
      paymentMethod: paymentMethod || 'razorpay',
      cart,
      subtotal,
      shipping,
      total,
      coupon,
      isBuyNow
    };

    if (isBuyNow) {
      console.log("🚀 Verified Buy Now payment, placing order...");
      await exports.placeBuyNowOrder(req, res);
    } else {
      console.log("🛒 Verified Cart payment, placing order...");
      await exports.placeOrder(req, res);
    }

  } catch (error) {
    console.error('❌ Verification error:', error);
    res.status(500).json({ message: 'Failed to verify payment', error: error.message });
  }
};


// Send WhatsApp Confirmation
exports.sendWhatsAppConfirmation = async (req, res) => {
  try {
    const { phone, orderId, amount, paymentMethod, items, deliveryDate, userName } = req.body;
    if (!phone || typeof phone !== 'string' || phone.trim() === '') {
      return res.status(400).json({ message: 'Invalid or missing phone number' });
    }
    await sendWhatsAppMessage(phone, orderId, amount, paymentMethod, items, deliveryDate, userName);
    res.status(200).json({ message: 'WhatsApp message sent successfully' });
  } catch (error) {
    console.error('WhatsApp confirmation error:', error);
    res.status(500).json({ message: 'Failed to send WhatsApp message' });
  }
};