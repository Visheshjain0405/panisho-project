import React, { useState, useEffect } from 'react';
import { Plus, Minus, Trash2, ShoppingBag, ArrowLeft, Heart, Star, Shield, Truck, CreditCard } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCoupon } from '../../context/CouponContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import api from '../../api/axiosInstance';

export default function CartPage() {
  const { cart, updateCart, removeFromCart } = useCart();
  const { appliedCoupon, setAppliedCoupon, discountAmount, setDiscountAmount } = useCoupon();
  // Coupan Logic

  const [coupons, setCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await api.get('/coupons');
        const activeCoupons = res.data.filter(coupon => coupon.isActive);
        setCoupons(activeCoupons);
        console.log('Fetched coupons:', activeCoupons);
      } catch (err) {
        console.error('Failed to fetch coupons:', err);
      }
    };
    fetchCoupons();
  });

  const navigate = useNavigate(); // Initialize useNavigate



  const subtotal = Math.round(
    cart.reduce((sum, item) => {
      const price = item.variant?.sellingPrice ?? 0;
      const quantity = item.quantity ?? 0;
      return sum + price * quantity;
    }, 0)
  );



  const shipping = subtotal > 499 ? 0 : 100; // Free shipping for orders above ₹499, else ₹100
  const grandTotal = subtotal + shipping - discountAmount;



  const freeShippingThreshold = 499;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const handleContinueShopping = () => {
    window.history.back();
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout'); // Navigate to the checkout page
  };

  const handleApplyCoupon = () => {
    const found = coupons.find(c => c.code === couponCode.trim().toUpperCase());
    if (!found) {
      setCouponError('Invalid coupon code');
      setAppliedCoupon(null);
      setDiscountAmount(0);
      return;
    }

    if (found.minPurchase && subtotal < found.minPurchase) {
      setCouponError(`Minimum purchase of ₹${found.minPurchase} required.`);
      return;
    }

    let discount = 0;
    if (found.type === 'percentage') {
      discount = (subtotal * found.discount) / 100;
      if (found.maxDiscount) {
        discount = Math.min(discount, found.maxDiscount);
      }
    } else {
      discount = found.discount;
    }

    setDiscountAmount(discount);
    setAppliedCoupon(found);
    setCouponError('');
  };



  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-pink-200 py-8 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-pink-200 p-8 text-center">
            <div className="relative mb-8">
              <div className="w-28 h-28 mx-auto bg-gradient-to-br from-pink-200 to-pink-300 rounded-full flex items-center justify-center shadow-lg">
                <ShoppingBag size={48} className="text-pink-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center shadow-lg">
                <Heart size={16} className="text-white fill-current" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-700 to-pink-500 bg-clip-text text-transparent mb-4">
              Your Cart Awaits
            </h1>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              Discover beautiful pieces that tell your story. Start your collection today.
            </p>
            <button
              onClick={handleContinueShopping}
              className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-pink-600 to-pink-500 text-white font-semibold rounded-2xl hover:from-pink-700 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Explore Collection
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-50 to-pink-200">
      {/* Sticky header */}
      <div className="relative z-10 backdrop-blur-md border-b border-pink-200 shadow-sm py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0">
            {/* Left: Back Button */}
            <button
              onClick={handleContinueShopping}
              className="group inline-flex items-center text-pink-700 hover:text-pink-800 font-medium transition-all"
            >
              <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm sm:text-base">Continue Shopping</span>
            </button>

            {/* Center: Title + Subtext */}
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                <span className="bg-gradient-to-r from-pink-700 to-pink-500 bg-clip-text text-transparent">
                  Shopping Cart
                </span>
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                You have <span className="font-semibold text-pink-700">{cart.length}</span> item{cart.length !== 1 ? 's' : ''} in your cart
              </p>
            </div>

            {/* Spacer for symmetry */}
            <div className="w-[140px] sm:w-[180px] hidden sm:block" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Cart Items */}
          <div className="xl:col-span-8 space-y-6">
            {cart.map((item) => {
              const product = item.productId;
              const qty = item.quantity || 0;
              const price = item.variant?.sellingPrice ?? 0;
              const itemTotal = price * qty;
              const volume = item.variant?.volume;
              const volumeUnit = item.variant?.volumeUnit;
              const imgUrl = product?.images?.[0] || '/placeholder.png';
              const name = product?.name || 'Unnamed Product';

              return (
                <div
                  key={item._id}
                  className="group relative bg-white/95 backdrop-blur-lg rounded-2xl border border-pink-200 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
                  style={{
                    boxShadow: '0 10px 30px rgba(255, 153, 153, 0.3), 0 4px 12px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {/* Decorative Corner Accent */}
                  <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-tl-2xl rounded-br-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />

                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">
                      {/* Product Image */}
                      <div className="flex-shrink-0 mx-auto sm:mx-0">
                        <div
                          className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-xl overflow-hidden bg-gradient-to-br from-pink-100 to-pink-200 border-2 border-pink-300 shadow-lg transform group-hover:rotate-2 transition-all duration-500"
                          style={{
                            boxShadow: '0 8px 20px rgba(255, 153, 153, 0.4)',
                          }}
                        >
                          <img
                            src={imgUrl}
                            alt={name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{name}</h3>
                            {volume && (
                              <p className="text-sm font-medium text-pink-600 mb-1">
                                {volume}{volumeUnit}
                              </p>
                            )}

                           
                          </div>

                          {/* Price and Actions */}
                          <div className="flex flex-col items-center sm:items-end gap-2">
                            <div className="text-center sm:text-right">
                              <p className="text-sm text-gray-500 line-through">₹{(price * 1.2).toFixed(2)}</p>
                              <p className="text-lg font-bold text-pink-600">₹{price.toFixed(2)}</p>
                            </div>
                            <div className="flex gap-2">
                              <button className="p-2 text-pink-600 hover:text-pink-800 hover:bg-pink-100 rounded-xl transition-all duration-300">
                                <Heart size={18} />
                              </button>
                              <button
                                onClick={() => removeFromCart(item._id)}
                                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-xl transition-all duration-300"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Quantity and Total */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-pink-200">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-700">Quantity:</span>
                            <div className="flex items-center bg-pink-50 border-2 border-pink-300 rounded-xl shadow-sm">
                              <button
                                onClick={() => updateCart(item._id, Math.max(1, qty - 1))}
                                className="p-2 hover:bg-pink-200 text-pink-600 rounded-l-xl transition-colors duration-300"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="px-4 py-2 font-bold text-gray-800 bg-white border-x border-pink-300 min-w-[3rem] text-center">
                                {qty}
                              </span>
                              <button
                                onClick={() => updateCart(item._id, qty + 1)}
                                className="p-2 hover:bg-pink-200 text-pink-600 rounded-r-xl transition-colors duration-300"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="text-center sm:text-right">
                            <p className="text-xl font-bold text-pink-600">₹{itemTotal.toFixed(2)}</p>
                            <p className="text-xs text-gray-500">Total</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="xl:col-span-4">
            <div className="sticky top-24">
              <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-pink-200 shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-pink-600 to-pink-400 p-6 text-white">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Shield size={20} />
                    Order Summary
                  </h2>
                  <p className="text-pink-100 text-sm mt-1">Secure & Protected</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Subtotal ({cart.length} items)</span>
                    <span className="font-semibold text-gray-900">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 flex items-center gap-2"><Truck size={16} /> Shipping</span>
                    <span className="font-semibold">
                      {shipping === 0
                        ? <span className="text-green-600 font-bold">Free</span>
                        : <span className="text-gray-900">₹{shipping.toFixed(2)}</span>}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <div className="bg-gradient-to-r from-pink-100 to-pink-200 p-4 rounded-2xl border border-pink-300">
                      <p className="text-sm text-pink-800 mb-3 font-medium">
                        🎉 Add ₹{remainingForFreeShipping.toFixed(2)} more for free shipping!
                      </p>
                      <div className="w-full bg-pink-300 rounded-full h-3 shadow-inner">
                        <div
                          className="bg-gradient-to-r from-pink-600 to-pink-400 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((subtotal / freeShippingThreshold) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
             
                  <div className="border-t-2 border-pink-200 pt-4">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-xl font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-pink-700 to-pink-500 bg-clip-text text-transparent">
                        ₹{grandTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    className="group w-full mt-6 px-6 py-4 bg-gradient-to-r from-pink-600 to-pink-400 text-white font-bold rounded-2xl hover:from-pink-700 hover:to-pink-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 relative overflow-hidden"
                    onClick={handleProceedToCheckout}
                  >
                    <span className="relative flex items-center justify-center gap-2">
                      <CreditCard size={20} />
                      Proceed to Checkout
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}