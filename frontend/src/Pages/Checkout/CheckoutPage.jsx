import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Phone, CreditCard, Shield, Truck, Gift, CheckCircle, Plus, Edit2, Home, Building2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import api from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCoupon } from '../../context/CouponContext';

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const { appliedCoupon, discountAmount } = useCoupon();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isBuyNow, setIsBuyNow] = useState(false);

  const navigate = useNavigate();
  const { user } = useAuth();

  const [newAddress, setNewAddress] = useState({
    type: 'home',
    name: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });

  const [couponCode, setCouponCode] = useState('');
  const { setAppliedCoupon, setDiscountAmount } = useCoupon();

  const handleApplyCoupon = async () => {
    try {
      const res = await api.post('/coupons/apply', {
        code: couponCode,
        subtotal,
        userId: user._id
      });

      const { discountAmount, coupon } = res.data;

      // Only apply if valid coupon and discountAmount is received
      if (!discountAmount || !coupon) {
        alert('Coupon is invalid or expired');
        return;
      }

      setDiscountAmount(discountAmount);
      setAppliedCoupon(coupon);
      alert(`✅ Coupon applied! You saved ₹${discountAmount}`);
    } catch (err) {
      alert(err.response?.data?.message || '❌ Invalid or already used coupon');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCode('');
  };


  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.variant?.sellingPrice ?? 0;
    const quantity = item.quantity ?? 0;
    return sum + price * quantity;
  }, 0);




  const shipping = subtotal > 499 ? 0 : 99;
  const total = subtotal + shipping;



  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const res = await api.get('/address');
        setSavedAddresses(res.data || []);
        if (res.data.length > 0) setSelectedAddress(res.data[0]._id);
      } catch (err) {
        console.error("Failed to load addresses", err);
      }
    };
    loadAddresses();
  }, []);

  useEffect(() => {
    const buyNowItem = JSON.parse(sessionStorage.getItem("buyNowItem"));

    if (buyNowItem) {
      setCartItems([
        {
          productId: buyNowItem.productId,
          quantity: buyNowItem.quantity,
          product: buyNowItem.product,
          variant: buyNowItem.variant
        }
      ]);
      setIsBuyNow(true);
    } else {
      setCartItems(cart); // from cart context
      setIsBuyNow(false);
    }
  }, [cart]);



  const handleAddressSubmit = async () => {
    try {
      if (editingAddress) {
        const res = await api.put(`/address/${editingAddress._id}`, newAddress);
        setSavedAddresses(prev =>
          prev.map(addr => addr._id === editingAddress._id ? res.data : addr)
        );
      } else {
        const res = await api.post('/address', newAddress);
        setSavedAddresses(prev => [...prev, res.data]);
        setSelectedAddress(res.data._id);
      }
      setNewAddress({
        type: 'home',
        name: '',
        street: '',
        city: '',
        state: '',
        pincode: '',
        phone: '',
      });
      setShowNewAddressForm(false);
      setEditingAddress(null);
    } catch (err) {
      console.error("Error saving/updating address", err);
      alert(err.response?.data?.message || "Failed to save address");
    }
  };

  const handleSelectAddress = (id) => {
    if (selectedAddress === id) {
      setSelectedAddress(null);
    } else {
      setSelectedAddress(id);
    }
  };

  const finalAmount = Math.round(subtotal + shipping - discountAmount);
  const selectedAddressId = selectedAddress;

  const sendWhatsAppMessage = async (orderId) => {
    if (!user?.phone || typeof user.phone !== 'string' || user.phone.trim() === '') {
      console.warn("No valid phone number provided for WhatsApp message");
      return;
    }
    try {
      await api.post('/checkout/send-whatsapp', {
        phone: user.phone,
        orderId,
        amount: finalAmount,
      });
    } catch (err) {
      console.error("Failed to send WhatsApp message:", err);
    }
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    const endpoint = isBuyNow ? '/checkout/place-buynow' : '/checkout/place-order';

    try {
      const res = await api.post(endpoint, {
        addressId: selectedAddress,
        paymentMethod,
        cart: cartItems,
        subtotal,
        shipping,
        total,
        coupon: appliedCoupon ? {
          code: appliedCoupon.code,
          discountAmount
        } : null
      });

      await sendWhatsAppMessage(res.data.orderId);
      clearCart();
      setAppliedCoupon(null);
      setDiscountAmount(0);
      sessionStorage.removeItem("buyNowItem");
      navigate('/');
    } catch (err) {
      setIsLoading(false);
      console.error("Order error:", err);
      alert(err.response?.data?.message || "Failed to place order");
    }
  };


  const handleRazorpayPayment = async (paymentMethod) => {
    setIsLoading(true);
    try {
      const res = await api.post('/checkout/create-razorpay-order', {
        amount: finalAmount,
      });
      const { razorpayOrderId } = res.data;

      const options = {
        key: 'rzp_test_Qy0cIp9EDLySmr',
        amount: finalAmount * 100,
        currency: "INR",
        name: "PANISHO",
        description: "Order Payment",
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            const verifyRes = await api.post('/checkout/verify', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              addressId: selectedAddressId,
              paymentMethod,
              cart: cartItems,
              subtotal,
              shipping,
              total,
              coupon: appliedCoupon ? {
                code: appliedCoupon.code,
                discountAmount
              } : null,
              isBuyNow  // ✅ this is critical for Razorpay + Buy Now
            });

            await sendWhatsAppMessage(verifyRes.data.orderId);
            clearCart();
            setAppliedCoupon(null);
            setDiscountAmount(0);
            setIsLoading(false);
            sessionStorage.removeItem("buyNowItem");
            navigate('/');
          } catch (error) {
            console.error("Verification error:", error);
            setIsLoading(false);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: user?.firstName || '',
          email: user?.email || '',
          contact: user?.phone || '',
        },
        theme: {
          color: "#e91e63",
        },
        method: {
          card: paymentMethod === 'card',
          upi: paymentMethod === 'upi',
          netbanking: false,
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response) {
        setIsLoading(false);
        alert("Payment failed. Please try again.");
        console.error("Razorpay payment failed:", response.error);
      });
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      setIsLoading(false);
      alert("Payment initiation failed. Try again.");
    }
  };

  const steps = [
    { id: 1, title: 'Address', icon: MapPin },
    { id: 2, title: 'Payment', icon: CreditCard },
    { id: 3, title: 'Review', icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-pink-200">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-pink-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.history.back()}
              className="group inline-flex items-center text-pink-700 hover:text-pink-800 font-medium transition-all duration-200"
            >
              <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Back to Cart</span>
              <span className="sm:hidden">Back</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-700 to-pink-500 bg-clip-text text-transparent">
              Secure Checkout
            </h1>
            <div className="flex items-center gap-2">
              <Shield size={20} className="text-green-500" />
              <span className="text-sm text-gray-600 hidden sm:inline">SSL Secured</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${currentStep >= step.id
                  ? 'bg-gradient-to-r from-pink-600 to-pink-400 border-pink-500 text-white shadow-lg'
                  : 'border-pink-200 text-pink-400 bg-white'
                  }`}>
                  <step.icon size={20} />
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-pink-600' : 'text-gray-500'}`}>
                    Step {step.id}
                  </p>
                  <p className={`text-xs ${currentStep >= step.id ? 'text-pink-500' : 'text-gray-400'}`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 sm:w-24 h-0.5 mx-4 transition-all duration-300 ${currentStep > step.id ? 'bg-gradient-to-r from-pink-600 to-pink-400' : 'bg-pink-200'
                    }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Step 1: Address */}
            {currentStep === 1 && (
              <div className="bg-white p-6 rounded-xl shadow-md border border-pink-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold flex items-center gap-2 text-pink-600">
                    <MapPin /> Delivery Address
                  </h2>
                  <button onClick={() => setShowNewAddressForm(true)} className="text-pink-600 flex items-center gap-1">
                    <Plus size={16} /> Add New
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedAddresses.map(addr => (
                    <div
                      key={addr._id}
                      className={`text-left border-2 rounded-xl p-4 cursor-pointer transition ${selectedAddress === addr._id
                        ? 'border-pink-500 bg-pink-50 shadow'
                        : 'border-pink-200 hover:border-pink-300'}`}
                      onClick={() => handleSelectAddress(addr._id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="flex gap-2 items-center font-semibold text-gray-700 capitalize">
                          {addr.type === 'home' ? <Home size={16} /> : <Building2 size={16} />} {addr.type}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingAddress(addr);
                            setShowNewAddressForm(true);
                            setNewAddress(addr);
                          }}
                        >
                          <Edit2 size={16} className="text-pink-600 hover:text-pink-800" />
                        </button>
                      </div>
                      <p className="font-medium">{addr.name}</p>
                      <p className="text-sm text-gray-600">{addr.street}</p>
                      <p className="text-sm text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                      <p className="text-sm text-gray-600 mt-1 flex gap-1 items-center"><Phone size={14} />{addr.phone}</p>
                    </div>
                  ))}
                </div>
                {showNewAddressForm && (
                  <div className="mt-6 border border-pink-300 p-4 rounded-xl bg-pink-50">
                    <h3 className="font-bold text-pink-600 mb-4">Add New Address</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        value={newAddress.name}
                        onChange={e => setNewAddress({ ...newAddress, name: e.target.value })}
                        placeholder="Full Name"
                        className="border p-2 rounded"
                      />
                      <input
                        type="text"
                        value={newAddress.phone}
                        onChange={e => setNewAddress({ ...newAddress, phone: e.target.value })}
                        placeholder="Phone Number"
                        className="border p-2 rounded"
                      />
                      <input
                        type="text"
                        value={newAddress.street}
                        onChange={e => setNewAddress({ ...newAddress, street: e.target.value })}
                        placeholder="Street Address"
                        className="border p-2 rounded col-span-full"
                      />
                      <input
                        type="text"
                        value={newAddress.city}
                        onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                        placeholder="City"
                        className="border p-2 rounded"
                      />
                      <input
                        type="text"
                        value={newAddress.state}
                        onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                        placeholder="State"
                        className="border p-2 rounded"
                      />
                      <input
                        type="text"
                        value={newAddress.pincode}
                        onChange={e => setNewAddress({ ...newAddress, pincode: e.target.value })}
                        placeholder="Pincode"
                        className="border p-2 rounded"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button onClick={handleAddressSubmit} className="bg-pink-600 text-white px-4 py-2 rounded">
                        Save Address
                      </button>
                      <button onClick={() => setShowNewAddressForm(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                <div className="flex justify-end mt-6">
                  <button
                    onClick={() => setCurrentStep(2)}
                    disabled={!selectedAddress}
                    className={`px-6 py-3 rounded-lg font-semibold transition ${selectedAddress
                      ? 'bg-pink-600 text-white hover:bg-pink-700'
                      : 'bg-pink-200 text-white cursor-not-allowed'
                      }`}
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Payment */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-pink-200 shadow-xl p-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-6">
                    <CreditCard className="text-pink-600" size={24} />
                    Payment Method
                  </h2>
                  <div className="space-y-4 mb-6">
                    <div
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${paymentMethod === 'card'
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-pink-200 bg-white hover:border-pink-300'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard size={20} className="text-pink-600" />
                        <span className="font-medium">Credit/Debit Card</span>
                      </div>
                    </div>
                    <div
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${paymentMethod === 'upi'
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-pink-200 bg-white hover:border-pink-300'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Phone size={20} className="text-pink-600" />
                        <span className="font-medium">UPI Payment</span>
                      </div>
                    </div>
                    <div
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${paymentMethod === 'cod'
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-pink-200 bg-white hover:border-pink-300'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <Truck size={20} className="text-pink-600" />
                        <span className="font-medium">Cash on Delivery</span>
                      </div>
                    </div>
                  </div>
                  {paymentMethod === 'cod' && (
                    <div className="bg-pink-50 rounded-2xl p-6 border border-pink-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Cash on Delivery</h3>
                      <div className="flex items-center gap-3 text-gray-600">
                        <Truck size={20} className="text-pink-600" />
                        <div>
                          <p className="font-medium">Pay when you receive</p>
                          <p className="text-sm">Cash payment to delivery partner</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between mt-6">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setCurrentStep(3)}
                      className="px-8 py-3 bg-gradient-to-r from-pink-600 to-pink-400 text-white rounded-xl hover:from-pink-700 hover:to-pink-500 transition-all duration-300 font-medium"
                    >
                      Review Order
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-pink-200 shadow-xl p-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-6">
                    <CheckCircle className="text-pink-600" size={24} />
                    Review Your Order
                  </h2>

                  {/* Address */}
                  <div className="mb-6 p-4 bg-pink-50 rounded-2xl border border-pink-200 text-start">
                    <h3 className="font-semibold text-gray-900 mb-2">Delivery Address</h3>
                    {selectedAddress ? (
                      (() => {
                        const address = savedAddresses.find(addr => addr._id === selectedAddress);
                        return address ? (
                          <div className="text-sm text-gray-600">
                            <p className="font-medium text-gray-900">{address.name}</p>
                            <p>{address.street}</p>
                            <p>{address.city}, {address.state} - {address.pincode}</p>
                            <p className="flex items-center gap-1 mt-1">
                              <Phone size={14} /> {address.phone}
                            </p>
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">Selected address not found.</p>
                        );
                      })()
                    ) : (
                      <p className="text-gray-500 text-sm">No address selected.</p>
                    )}
                  </div>

                  {/* Payment */}
                  <div className="mb-6 p-4 bg-pink-50 rounded-2xl border border-pink-200 text-start">
                    <h3 className="font-semibold text-gray-900 mb-2">Payment Method</h3>
                    <p className="text-sm text-gray-600 capitalize">
                      {paymentMethod === 'card' && 'Credit/Debit Card'}
                      {paymentMethod === 'upi' && 'UPI Payment'}
                      {paymentMethod === 'cod' && 'Cash on Delivery'}
                    </p>
                  </div>

                  {/* Order Items */}
                  <div className="mb-6 p-4 bg-pink-50 rounded-2xl border border-pink-200 text-start">
                    <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
                    <div className="space-y-3">
                      {cartItems.map((item) => {
                        const product = item.product || item.productId;
                        const variant = item.variant;
                        const qty = item.quantity || 1;
                        const price = variant?.sellingPrice ?? 0;
                        const itemTotal = price * qty;

                        return (
                          <div key={item._id} className="flex gap-3">
                            <img
                              src={product.images?.[0] || '/placeholder.png'}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-xl border border-pink-200"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
                              {variant?.volume && (
                                <p className="text-xs text-gray-500">
                                  Variant: {variant.volume} {variant.volumeUnit}
                                </p>
                              )}
                              <p className="text-xs text-gray-600">Qty: {qty}</p>
                              <p className="text-sm font-semibold text-pink-600 text-end">₹{itemTotal.toFixed(0)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
                    >
                      Back
                    </button>

                    {paymentMethod === 'card' && (
                      <button
                        onClick={() => handleRazorpayPayment('card')}
                        disabled={isLoading}
                        className={`px-8 py-3 bg-pink-600 text-white rounded-xl hover:bg-pink-700 transition-all duration-300 font-medium shadow-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        Pay with Card
                      </button>
                    )}
                    {paymentMethod === 'upi' && (
                      <button
                        onClick={() => handleRazorpayPayment('upi')}
                        disabled={isLoading}
                        className={`px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 font-medium shadow-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        Pay with UPI
                      </button>
                    )}
                    {paymentMethod === 'cod' && (
                      <button
                        onClick={handlePlaceOrder}
                        disabled={isLoading}
                        className={`px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 font-medium shadow-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        Place Order (COD)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-pink-200 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-pink-600 to-pink-400 p-6 text-white">
                  <h2 className="text-xl font-bold">Order Summary</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4 mb-6">
                    {cartItems.map((item) => {
                      const product = item.product || item.productId;
                      const variant = item.variant;
                      const qty = item.quantity || 1;
                      const price = variant?.sellingPrice ?? 0;
                      const itemTotal = price * qty;

                      return (
                        <div key={item._id} className="flex gap-3">
                          <img
                            src={product.images?.[0] || '/placeholder.png'}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded-xl border border-pink-200"
                          />
                          <div className="flex-1 text-start">
                            <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
                            {variant?.volume && (
                              <p className="text-xs text-gray-500">
                                Variant: {variant.volume} {variant.volumeUnit}
                              </p>
                            )}
                            <p className="text-xs text-gray-600">Qty: {qty}</p>
                            <p className="text-sm font-semibold text-pink-600 text-end">₹{itemTotal.toFixed(0)}</p>
                          </div>
                        </div>
                      );
                    })}

                  </div>

                  <div className="space-y-3 border-t border-pink-200 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">₹{subtotal.toFixed(0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 ? (
                          <span className="text-green-600">Free</span>
                        ) : (
                          `₹${shipping.toLocaleString()}`
                        )}
                      </span>
                    </div>

                    {/* Coupon Input */}
                    {appliedCoupon ? (
                      <div className="bg-green-100 border border-green-300 text-green-800 rounded-md p-3 text-sm mb-4 flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            Coupon <span className="font-semibold uppercase">{appliedCoupon.code}</span> applied.
                          </p>
                          <p className="text-xs text-green-700 text-start">Saved ₹{discountAmount.toFixed(2)}</p>
                        </div>
                        <button
                          onClick={() => {
                            setAppliedCoupon(null);
                            setDiscountAmount(0);
                            setCouponCode('');
                          }}
                          className="text-red-600 text-sm font-medium hover:underline ml-4"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 mb-4">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Enter coupon code"
                          className="flex-1 border border-pink-300 rounded-lg p-2 text-sm"
                        />
                        <button
                          onClick={handleApplyCoupon}
                          className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pink-700 transition"
                        >
                          Apply
                        </button>
                      </div>
                    )}




                    {/* Total */}
                    <div className="flex justify-between text-lg font-bold pt-3 border-t border-pink-200">
                      <span>Total</span>
                      <span className="text-pink-600">₹{Math.round(subtotal + shipping - discountAmount)}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-pink-200">
                    <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Shield size={14} className="text-green-500" />
                        <span>Secure</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Truck size={14} className="text-blue-500" />
                        <span>Fast Delivery</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Shield size={14} className="text-red-500" />
                        <span>No Return Policy</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading Animation */}
          {isLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-transparent border-t-pink-600 animate-spin">
                  <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-transparent border-t-pink-500 opacity-75 animate-spin" style={{ animationDelay: '-0.2s' }}></div>
                  <div className="absolute top-0 left-0 w-16 h-16 rounded-full border-4 border-transparent border-t-pink-400 opacity-50 animate-spin" style={{ animationDelay: '-0.4s' }}></div>
                </div>
                <p className="text-white mt-4 font-medium">Processing Payment...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}