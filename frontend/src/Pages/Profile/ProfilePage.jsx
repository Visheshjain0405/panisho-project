import React, { useState, useEffect } from 'react';
import {
  Mail, Phone, LogOut, User, MapPin, Package, MessageCircle, Heart, Lock,
  Calendar, Truck, Clock, CheckCircle, XCircle, Download, Star, Filter, Search, Menu, X, Edit3, CreditCard, Plus
} from 'lucide-react';
import api from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';

export default function ProfilePage() {
  const { user, loading: authLoading, logout } = useAuth() || { user: null, loading: true };
  const { wishlist, loading: wishlistLoading } = useWishlist();
  const [activeSection, setActiveSection] = useState('orders');
  const [orderFilter, setOrderFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [editAddressForm, setEditAddressForm] = useState({ id: '', type: 'home', name: '', street: '', city: '', state: '', pincode: '', phone: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [contactForm, setContactForm] = useState({ subject: '', message: '' });

  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      if (!user) {
        console.log('No user authenticated, skipping order fetch');
        if (isMounted) setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await api.get('/orders/my-orders');
        console.log('Fetched user orders:', response.data);
        if (isMounted) setOrders(response.data || []);
      } catch (err) {
        console.error('API Error:', err);
        if (isMounted) setError('Failed to fetch orders. Please check your network or try again later.');
        if (isMounted) setOrders([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const fetchAddresses = async () => {
      if (!user) return;
      try {
        const response = await api.get('/address');
        console.log('Fetched user addresses:', response.data);
        if (isMounted) setAddresses(response.data || []);
      } catch (err) {
        console.error('Address fetch error:', err);
        if (isMounted) setError('Failed to fetch addresses. Please try again.');
      }
    };

    const fetchWishlistProducts = async () => {
      if (!user || wishlist.length === 0) return;
      try {
        const response = await api.get('/products', { params: { ids: wishlist.join(',') } });
        console.log('Fetched wishlist products:', response.data);
        if (isMounted) setWishlistProducts(response.data || []);
      } catch (err) {
        console.error('Wishlist products fetch error:', err);
        if (isMounted) setError('Failed to fetch wishlist products. Please try again.');
      }
    };

    fetchOrders();
    fetchAddresses();
    fetchWishlistProducts();

    return () => {
      isMounted = false;
    };
  }, [user, wishlist]);

  const getStatusConfig = (status) => {
    const configs = {
      pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Clock, label: 'Order Placed', description: 'Your order is being processed' },
      processing: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Package, label: 'Processing', description: 'Your order is being prepared' },
      shipped: { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Truck, label: 'Shipped', description: 'Your order is on the way' },
      delivered: { color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle, label: 'Delivered', description: 'Order delivered successfully' },
      cancelled: { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle, label: 'Cancelled', description: 'Order was cancelled' }
    };
    return configs[status?.toLowerCase()] || configs.pending;
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';
  };

  const formatCurrency = (amount) => {
    return amount ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount) : '₹0.00';
  };

  const getDiscountPercentage = (mrp, sellingPrice) => {
    return mrp && sellingPrice ? Math.round(((mrp - sellingPrice) / mrp) * 100) : 0;
  };

  const filteredOrders = orders.filter(order => {
    if (!order) return false;
    const matchesFilter = orderFilter === 'all' || order.status === orderFilter;
    const matchesSearch = searchTerm === '' ||
      (order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (order.items?.some(item => item.name?.toLowerCase().includes(searchTerm.toLowerCase())) || false);
    return matchesFilter && matchesSearch;
  });

  const getExpectedDeliveryDate = (createdAt) => {
    return createdAt ? new Date(new Date(createdAt).setDate(new Date(createdAt).getDate() + 7)).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : 'N/A';
  };

  const handleEditAddress = (address) => {
    setEditAddressForm({
      id: address._id,
      type: address.type,
      name: address.name || '',
      street: address.street || '',
      city: address.city || '',
      state: address.state || '',
      pincode: address.pincode || '',
      phone: address.phone || ''
    });
    setIsEditAddressModalOpen(true);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(null);
      const response = await api.put(`/address/${editAddressForm.id}`, editAddressForm);
      console.log('Address updated:', response.data);
      setAddresses(addresses.map(addr => addr._id === editAddressForm.id ? response.data : addr));
      setSuccess('Address updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
      setIsEditAddressModalOpen(false);
    } catch (err) {
      console.error('Update address error:', err);
      setError(err.response?.data?.message || 'Failed to update address. Please try again.');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }
    try {
      setError(null);
      setSuccess(null);
      await api.put('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      setSuccess('Password changed successfully!');
      setTimeout(() => setSuccess(null), 3000);
      setIsChangePasswordModalOpen(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error('Change password error:', err);
      setError(err.response?.data?.message || 'Failed to change password. Please try again.');
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(null);
      await api.post('/contact', contactForm);
      setSuccess('Your message has been sent successfully!');
      setTimeout(() => setSuccess(null), 3000);
      setIsContactModalOpen(false);
      setContactForm({ subject: '', message: '' });
    } catch (err) {
      console.error('Contact form error:', err);
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    }
  };

  const sidebarItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'My Orders', icon: Package },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'contact', label: 'Contact Support', icon: MessageCircle },
  ];

  const renderOrdersContent = () => {
    if (authLoading || loading) return <div className="text-center py-8 sm:py-12">Loading...</div>;
    if (error) return <div className="text-center py-8 sm:py-12 text-red-600">{error}</div>;
    if (success) return <div className="text-center py-8 sm:py-12 text-green-600">{success}</div>;

    return (
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 border border-pink-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2 mb-2">
              <Package className="text-pink-600 w-5 h-5 sm:w-6 sm:h-6" />
              My Orders
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">Track and manage your beauty orders</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 sm:py-2.5 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 w-full sm:w-56"
              />
            </div>
            <div className="relative w-full sm:w-auto">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <select
                value={orderFilter}
                onChange={(e) => setOrderFilter(e.target.value)}
                className="pl-10 pr-8 py-2 sm:py-2.5 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 appearance-none bg-white w-full sm:w-40"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="text-6xl sm:text-8xl mb-4">📦</div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              {searchTerm || orderFilter !== 'all' ? 'No matching orders found' : 'No orders yet'}
            </h3>
            <p className="text-gray-600 mb-4 text-sm sm:text-lg">
              {searchTerm || orderFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'Start shopping to see your orders here!'}
            </p>
            {(!searchTerm && orderFilter === 'all') && (
              <button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold transition-all hover:scale-105 shadow-lg">
                Start Shopping
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            {filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div key={order.id} className="border-2 border-pink-100 rounded-2xl sm:rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-white to-pink-50/30">
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-3 sm:p-4 md:p-6 border-b border-pink-100">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <div>
                          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1 text-start">
                            {order.orderNumber || `#${order._id?.slice(0, 6).toUpperCase() || 'N/A'}`}
                          </h3>
                          <p className="text-gray-600 text-sm flex items-center gap-1 sm:gap-2">
                            <Calendar className="w-3 sm:w-4 h-3 sm:h-4" />
                            Placed on {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full border font-semibold ${statusConfig.color}`}>
                          <StatusIcon className="w-3 sm:w-4 h-3 sm:h-4" />
                          {statusConfig.label}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg sm:text-xl md:text-2xl font-bold text-pink-600">
                          {formatCurrency(order.total)}
                        </p>
                        <p className="text-xs sm:text-sm md:text-base text-gray-600">
                          {order.items?.length || 0} item{order.items?.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 md:p-6">
                    <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                      {order.items
                        ?.filter(item => item.productId)
                        .map((item) => (
                          <div key={item.id} className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-2 sm:p-3 md:p-4 bg-white rounded-xl sm:rounded-2xl border border-pink-100 hover:shadow-md transition-all">
                            <div className="relative w-full sm:w-20 aspect-[4/5]">
                              <img
                                src={item.productId?.images?.[0] || '/placeholder.jpg'}
                                alt={item.productId?.name || 'Product Image'}
                                className="w-full h-full object-cover rounded-xl border-2 border-pink-100"
                                onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                              />
                              {item.mrp > item.price && (
                                <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-red-500 text-white text-xs font-bold px-1 sm:px-2 py-0.5 sm:py-1 rounded-full">
                                  {getDiscountPercentage(item.mrp, item.price)}% OFF
                                </div>
                              )}
                            </div>
                            <div className="flex-1 text-left">
                              <h4 className="font-bold text-gray-800 text-sm sm:text-base mb-1">{item.productId?.name || 'N/A'}</h4>
                              <p className="text-gray-600 text-xs sm:text-sm mb-1 line-clamp-2">{item.productId?.description || 'No description'}</p>
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs sm:text-sm text-gray-500">
                                <span>Volume: {item.variant?.volume || 'N/A'} {item.variant?.volumeUnit || ''}</span>
                                <span>Qty: {item.quantity || 0}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center gap-1 sm:gap-2 mb-1">
                                <span className="text-base sm:text-lg font-bold text-gray-800">
                                  {formatCurrency(item.variant?.sellingPrice || 0)}
                                </span>
                              </div>
                              {order.status === 'delivered' && (
                                <div className="flex items-center text-yellow-500 text-xs sm:text-sm">
                                  <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                                  Rate Product
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-3 sm:p-4 md:p-6 border border-pink-100">
                        <h4 className="font-bold text-gray-800 text-sm sm:text-base md:text-lg mb-2 sm:mb-4 flex items-center gap-1 sm:gap-2">
                          <CreditCard className="w-4 sm:w-5 h-4 sm:h-5 text-pink-600" />
                          Order Summary
                        </h4>
                        <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal:</span>
                            <span className="font-medium">{formatCurrency(order.subtotal || 0)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Shipping:</span>
                            <span className="font-medium">{formatCurrency(order.shipping || 0)}</span>
                          </div>
                          <div className="border-t border-pink-200 pt-1 sm:pt-2 mt-1 sm:mt-2">
                            <div className="flex justify-between text-sm sm:text-base md:text-lg font-bold">
                              <span>Total:</span>
                              <span className="text-pink-600">{formatCurrency(order.total || 0)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 sm:mt-4 pt-2 sm:pt-4 border-t border-pink-200">
                          <p className="text-xs sm:text-sm text-gray-600 mb-1">
                            <span className="font-medium">Payment:</span> {order.paymentMethod || 'N/A'}
                          </p>
                          {order.trackingNumber && (
                            <p className="text-xs sm:text-sm text-gray-600">
                              <span className="font-medium">Tracking:</span> {order.trackingNumber}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3 sm:space-y-4">
                        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-pink-100">
                          <h4 className="font-bold text-gray-800 text-sm sm:text-base mb-2 sm:mb-4">Order Actions</h4>
                          <div className="space-y-2">
                            <button className="w-full flex items-center justify-center gap-1 sm:gap-2 bg-pink-600 hover:bg-pink-700 text-white py-2 sm:py-3 rounded-xl font-semibold transition-colors">
                              <Download className="w-3 sm:w-4 h-3 sm:h-4" />
                              Download Invoice
                            </button>
                          </div>
                        </div>
                        {order.status !== 'cancelled' && (
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-3 sm:p-4 border border-blue-100">
                            <h4 className="font-bold text-gray-800 text-sm sm:text-base mb-2 flex items-center gap-1 sm:gap-2 text-start">
                              <Truck className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" />
                              Delivery Information
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-600 text-start">
                              <span className="font-medium text-blue-600">Expected delivery:</span>{' '}
                              {getExpectedDeliveryDate(order.createdAt)} (within 7 days of order)
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (authLoading) return <div className="text-center py-8 sm:py-12">Authenticating...</div>;

    switch (activeSection) {
      case 'orders':
        return renderOrdersContent();

      case 'profile':
        return (
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-10 border border-pink-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                <User className="text-pink-600 w-5 h-5 sm:w-6 sm:h-6" />
                Profile Information
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-6 mb-6 sm:mb-8">
              <div className="w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-pink-200 via-rose-200 to-pink-300 rounded-full flex items-center justify-center shadow-lg border-4 border-white mb-4 sm:mb-0">
                <User className="w-12 sm:w-16 h-12 sm:h-16 text-pink-600" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1">
                  {user?.firstName || 'N/A'} {user?.lastName || ''}
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">Customer since 2024</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                  <div className="flex items-center space-x-2 sm:space-x-4 p-2 sm:p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl border border-pink-100">
                    <Mail className="w-4 sm:w-6 h-4 sm:h-6 text-pink-500" />
                    <span className="text-gray-800 font-medium text-sm sm:text-base">{user?.email || 'N/A'}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <div className="flex items-center space-x-2 sm:space-x-4 p-2 sm:p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl border border-pink-100">
                    <Phone className="w-4 sm:w-6 h-4 sm:h-6 text-pink-500" />
                    <span className="text-gray-800 font-medium text-sm sm:text-base">{user?.mobile || 'N/A'}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">Account Status</label>
                  <div className="p-2 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                    <span className="text-green-700 font-bold flex items-center gap-1 sm:gap-2 text-sm sm:text-base">
                      <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5" />
                      Active & Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'addresses':
        return (
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-10 border border-pink-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
                <MapPin className="text-pink-500 w-6 h-6 sm:w-7 sm:h-7" />
                Delivery Address
              </h2>
              <button
                onClick={handleAddressSubmit}
                className="flex items-center gap-2 text-pink-500 hover:text-pink-600 transition-colors font-medium text-sm sm:text-base"
              >
                <Plus className="w-4 h-4" />
                Add New
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8 sm:py-12">Loading...</div>
            ) : error ? (
              <div className="text-center py-8 sm:py-12 text-red-600">{error}</div>
            ) : addresses.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="text-6xl sm:text-8xl mb-4">📍</div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">No addresses found</h3>
                <p className="text-gray-600 mb-4 text-sm sm:text-lg">Add an address to get started!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {addresses.map((address) => (
                  <div
                    key={address._id}
                    className="border border-pink-200 rounded-2xl p-5 sm:p-6 bg-gradient-to-br from-pink-50/30 to-white hover:shadow-lg transition-all duration-300 relative group"
                  >
                    {/* Home Icon and Edit Button */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                          <svg className="w-4 h-4 text-pink-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                          </svg>
                        </div>
                        <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          {address.type}
                        </span>
                      </div>
                      <button
                        onClick={() => handleEditAddress(address)}
                        className="text-gray-400 hover:text-pink-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Address Details */}
                    <div className="space-y-3 text-start">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800 leading-tight">
                        {address.name || 'Unnamed Address'}
                      </h3>

                      <div className="text-gray-600 text-sm sm:text-base leading-relaxed">
                        <p>{address.street}</p>
                        {address.area && <p>{address.area}</p>}
                        <p>{address.city}, {address.state} - {address.pincode}</p>
                      </div>

                      <div className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {address.phone}
                      </div>

                      {/* Default Address Badge */}
                      {address.isDefault && (
                        <div className="pt-2">
                          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-700 font-semibold text-xs">
                            <CheckCircle className="w-3 h-3" />
                            Default Address
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'wishlist':
        return (
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-10 border border-pink-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                <Heart className="text-pink-600 w-5 h-5 sm:w-6 sm:h-6" />
                My Wishlist
              </h2>
            </div>
            {wishlistLoading ? (
              <div className="text-center py-8 sm:py-12">Loading...</div>
            ) : error ? (
              <div className="text-center py-8 sm:py-12 text-red-600">{error}</div>
            ) : wishlistProducts.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="text-6xl sm:text-8xl mb-4">❤️</div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h3>
                <p className="text-gray-600 mb-4 text-sm sm:text-lg">Add some products to your wishlist!</p>
                <button className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold transition-all hover:scale-105 shadow-lg">
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {wishlistProducts.map((product) => (
                  <div key={product._id} className="border-2 border-pink-100 rounded-2xl p-4 bg-white hover:shadow-md transition-all">
                    <img
                      src={product.images?.[0] || '/placeholder.jpg'}
                      alt={product.name || 'Product Image'}
                      className="w-full h-48 object-cover rounded-xl mb-4"
                      onError={(e) => { e.target.src = '/placeholder.jpg'; }}
                    />
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{product.name || 'N/A'}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{product.description || 'No description'}</p>
                    <p className="text-lg font-bold text-pink-600 mt-2">{formatCurrency(product.price)}</p>
                    {product.mrp > product.price && (
                      <span className="text-sm text-red-500">{getDiscountPercentage(product.mrp, product.price)}% OFF</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'security':
        return (
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-10 border border-pink-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                <Lock className="text-pink-600 w-5 h-5 sm:w-6 sm:h-6" />
                Security
              </h2>
              <button
                onClick={() => setIsChangePasswordModalOpen(true)}
                className="flex items-center space-x-2 text-pink-600 hover:text-pink-700 transition-colors bg-pink-50 px-4 py-2 rounded-full hover:bg-pink-100"
              >
                <Lock className="w-4 h-4" />
                <span className="font-medium text-sm sm:text-base">Change Password</span>
              </button>
            </div>
            <div className="text-gray-600 text-sm sm:text-base">Manage your account security settings.</div>
          </div>
        );

      case 'contact':
        return (
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-10 border border-pink-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                <MessageCircle className="text-pink-600 w-5 h-5 sm:w-6 sm:h-6" />
                Contact Support
              </h2>
              <button
                onClick={() => setIsContactModalOpen(true)}
                className="flex items-center space-x-2 text-pink-600 hover:text-pink-700 transition-colors bg-pink-50 px-4 py-2 rounded-full hover:bg-pink-100"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="font-medium text-sm sm:text-base">Contact Us</span>
              </button>
            </div>
            <div className="text-gray-600 text-sm sm:text-base">Reach out to our support team for assistance.</div>
          </div>
        );

      default:
        return (
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 md:p-10 border border-pink-100">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
              {sidebarItems.find(item => item.id === activeSection)?.label}
            </h2>
            <div className="text-center py-8 sm:py-12">
              <div className="text-5xl sm:text-8xl mb-4">🚧</div>
              <p className="text-gray-600 text-base sm:text-xl">This section is coming soon...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-gradient-to-br from-pink-50 via-white to-rose-50 min-h-screen">
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <div className="sm:hidden mb-4 flex justify-start">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 bg-pink-200 text-pink-600 rounded-full hover:bg-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <div className="hidden sm:block sm:w-72">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 sticky top-4 sm:top-6 border border-pink-100">
              <div className="text-center mb-4 sm:mb-6">
                <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-pink-200 to-rose-300 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4 shadow-lg border-4 border-white">
                  <span className="text-2xl sm:text-3xl">🪷</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">
                  {user?.firstName || 'N/A'} {user?.lastName || ''}
                </h2>
              </div>
              <nav className="space-y-2 sm:space-y-3">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-xl transition-all duration-300 font-medium ${activeSection === item.id
                        ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md transform scale-105'
                        : 'text-gray-700 hover:bg-pink-50 hover:text-pink-600 hover:scale-105'
                        }`}
                    >
                      <Icon className="w-4 sm:w-5 h-4 sm:h-5" />
                      <span className="text-sm sm:text-base">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
              <button
                onClick={() => { logout(); }}
                className="mt-4 sm:mt-6 w-full flex items-center justify-center space-x-2 sm:space-x-3 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 sm:py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-md"
              >
                <LogOut className="w-4 sm:w-5 h-4 sm:h-5" />
                <span className="text-sm sm:text-base">Logout</span>
              </button>
            </div>
          </div>

          {isSidebarOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 sm:hidden" onClick={() => setIsSidebarOpen(false)}>
              <div className="fixed left-0 top-0 w-64 h-full bg-white p-4 shadow-lg z-50" onClick={e => e.stopPropagation()}>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="absolute top-4 right-4 text-gray-600 hover:text-pink-600"
                >
                  <X className="w-6 h-6" />
                </button>
                <nav className="space-y-3 mt-10">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { setActiveSection(item.id); setIsSidebarOpen(false); }}
                        className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 font-medium ${activeSection === item.id
                          ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                          : 'text-gray-700 hover:bg-pink-50 hover:text-pink-600'
                          }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-base">{item.label}</span>
                      </button>
                    );
                  })}
                </nav>
                <button
                  onClick={() => { logout(); setIsSidebarOpen(false); }}
                  className="mt-6 w-full flex items-center justify-center space-x-3 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-base">Logout</span>
                </button>
              </div>
            </div>
          )}

          <div className="flex-1">
            {renderContent()}
          </div>

          {isEditAddressModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md text-start">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Edit Address</h2>
                  <button onClick={() => setIsEditAddressModalOpen(false)} className="text-gray-600 hover:text-pink-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleAddressSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Address Type</label>
                    <select
                      value={editAddressForm.type}
                      onChange={(e) => setEditAddressForm({ ...editAddressForm, type: e.target.value })}
                      className="w-full p-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="home">Home</option>
                      <option value="office">Office</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={editAddressForm.name}
                      onChange={(e) => setEditAddressForm({ ...editAddressForm, name: e.target.value })}
                      className="w-full p-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Street</label>
                    <input
                      type="text"
                      value={editAddressForm.street}
                      onChange={(e) => setEditAddressForm({ ...editAddressForm, street: e.target.value })}
                      className="w-full p-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={editAddressForm.city}
                      onChange={(e) => setEditAddressForm({ ...editAddressForm, city: e.target.value })}
                      className="w-full p-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      value={editAddressForm.state}
                      onChange={(e) => setEditAddressForm({ ...editAddressForm, state: e.target.value })}
                      className="w-full p-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Pincode</label>
                    <input
                      type="text"
                      value={editAddressForm.pincode}
                      onChange={(e) => setEditAddressForm({ ...editAddressForm, pincode: e.target.value })}
                      className="w-full p-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={editAddressForm.phone}
                      onChange={(e) => setEditAddressForm({ ...editAddressForm, phone: e.target.value })}
                      className="w-full p-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  {error && <div className="text-red-600 text-sm">{error}</div>}
                  {success && <div className="text-green-600 text-sm">{success}</div>}
                  <button
                    type="submit"
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-xl font-semibold transition-colors"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            </div>
          )}

          {isChangePasswordModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md text-start">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Change Password</h2>
                  <button onClick={() => setIsChangePasswordModalOpen(false)} className="text-gray-600 hover:text-pink-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Current Password</label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full p-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full p-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full p-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  {error && <div className="text-red-600 text-sm">{error}</div>}
                  {success && <div className="text-green-600 text-sm">{success}</div>}
                  <button
                    type="submit"
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-xl font-semibold transition-colors"
                  >
                    Change Password
                  </button>
                </form>
              </div>
            </div>
          )}

          {isContactModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md text-start">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Contact Us</h2>
                  <button onClick={() => setIsContactModalOpen(false)} className="text-gray-600 hover:text-pink-600">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full p-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
                    <textarea
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full p-2 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                      rows="5"
                    />
                  </div>
                  {error && <div className="text-red-600 text-sm">{error}</div>}
                  {success && <div className="text-green-600 text-sm">{success}</div>}
                  <button
                    type="submit"
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-xl font-semibold transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}