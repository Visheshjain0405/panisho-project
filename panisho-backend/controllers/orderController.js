const mongoose = require('mongoose');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'firstName lastName email mobile')
      .populate('items.productId', 'name sellingPrice')
      .populate('addressId', 'street city state pincode landmark');

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// Get single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching order with ID:', id)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid order ID format' });
    }

    const order = await Order.findById(id)
      .populate('userId', 'firstName lastname email mobile')
      .populate('items.productId', 'name sellingPrice')
      .populate('addressId', 'street city state pincode landmark');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
};


// Delete order by ID
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await Order.findByIdAndDelete(id);
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Failed to delete order' });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Validate status and paymentStatus if necessary
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded'];

    if (status && !validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus.toLowerCase())) {
      return res.status(400).json({ message: 'Invalid payment status' });
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();
    res.status(200).json({ message: 'Order updated successfully', order });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Failed to update order' });
  }
};

// Get orders of the logged-in user
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    console.log('User ID from request:', userId);
    console.log('Fetching orders for user:', userId);
    const orders = await Order.find({ userId })
      .populate({
        path: 'items.productId',
        select: 'name image price mrp description volume images' // ensure required fields
      })
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.error('Failed to get user orders:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get payment data and totals
exports.getPaymentData = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'firstName lastName email')
      .select('orderId paymentMethod total paymentStatus createdAt');

    const paymentTotals = await Order.aggregate([
      {
        $group: {
          _id: '$paymentMethod',
          totalAmount: { $sum: '$total' },
          count: { $sum: 1 }
        }
      },
      {
        $project: {
          paymentMethod: '$_id',
          totalAmount: 1,
          count: 1,
          _id: 0
        }
      }
    ]);

    res.status(200).json({
      orders,
      paymentTotals
    });
  } catch (error) {
    console.error('Error fetching payment data:', error);
    res.status(500).json({ message: 'Failed to fetch payment data' });
  }
};

// Get most selling products
exports.getTopSellingProducts = async (req, res) => {
  try {
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          totalQuantitySold: { $sum: '$items.quantity' }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          productId: '$_id',
          totalQuantitySold: 1,
          name: '$product.name',
          description: '$product.description',
          images: '$product.images',
          displayOptions: '$product.displayOptions',
          variants: '$product.variants',
          targetAudience: '$product.targetAudience',
          category: '$product.category',
          ingredients: '$product.ingredients',
          usageInstructions: '$product.usageInstructions',
          slug: '$product.slug'
        }
      },
      { $sort: { totalQuantitySold: -1 } },
      { $limit: 10 }
    ]);

    res.status(200).json(topProducts);
  } catch (error) {
    console.error('Error fetching top selling products:', error);
    res.status(500).json({ message: 'Failed to get top selling products' });
  }
};


     