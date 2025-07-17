import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Grid, List, ChevronLeft, ChevronRight, Eye, Edit, Package, Clock, CheckCircle, XCircle, Truck, CreditCard, ArrowUpDown, Download, FileText, Tag, UserCircle, Map } from 'lucide-react';
import api from '../../api/axiosInstance';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const OrderDisplay = () => {
  const [orders, setOrders] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewMode, setViewMode] = useState('table');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Status and payment method options aligned with backend schema
  const statusOptions = [
    { value: 'Pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
    { value: 'Processing', label: 'Processing', color: 'bg-blue-100 text-blue-800', icon: Package },
    { value: 'Shipped', label: 'Shipped', color: 'bg-purple-100 text-purple-800', icon: Truck },
    { value: 'Delivered', label: 'Delivered', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    { value: 'Cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: XCircle },
  ];

  const paymentMethodOptions = [
    { value: 'card', label: 'Card', color: 'bg-blue-100 text-blue-800' },
    { value: 'upi', label: 'UPI', color: 'bg-purple-100 text-purple-800' },
    { value: 'cod', label: 'Cash on Delivery', color: 'bg-green-100 text-green-800' },
  ];

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get('/orders');
        setOrders(response.data);
        console.log('Fetched orders:', response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Update order status
  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await api.patch(`/orders/${id}/status`, { status });
      setOrders(orders.map((order) => (order._id === id ? response.data.order : order)));
      setIsEditModalOpen(false);
      setSelectedOrder(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status');
    }
  };

  // Format price
  const formatPrice = (price) => {
    if (!price && price !== 0) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Handle download slip
  const handleDownloadSlip = async (order) => {
    setSelectedOrder(order);
    setTimeout(async () => {
      const slipElement = document.getElementById('printable-slip');
      if (!slipElement) {
        alert("Slip content not found");
        return;
      }

      try {
        // Set canvas to A4 size (210mm x 297mm at 96 DPI)
        const canvas = await html2canvas(slipElement, {
          scale: 2,
          width: 794, // 210mm * 3.78 pixels/mm
          height: 1123, // 297mm * 3.78 pixels/mm
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`order-slip-${order._id}.pdf`);
      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate order slip');
      }
    }, 100);
  };

  // Get status and payment method config
  const getStatusConfig = (status) => statusOptions.find((s) => s.value === status) || statusOptions[0];
  const getPaymentMethodConfig = (method) => paymentMethodOptions.find((m) => m.value === method) || paymentMethodOptions[2];

  // Filter and sort orders
  const filteredOrders = useMemo(() => {
    let filtered = orders;
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order._id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.userId?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.addressId?.toString().toLowerCase().includes(searchTerm.toLowerCase()),

      );
    }
    if (selectedStatus) {
      filtered = filtered.filter((order) => order.status === selectedStatus);
    }
    if (selectedPaymentMethod) {
      filtered = filtered.filter((order) => order.paymentMethod === selectedPaymentMethod);
    }
    filtered = [...filtered].sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1;
      switch (sortBy) {
        case '_id':
          return order * a._id.toString().localeCompare(b._id.toString());
        case 'createdAt':
          return order * (new Date(a.createdAt) - new Date(b.createdAt));
        case 'total':
          return order * (a.total - b.total);
        default:
          return 0;
      }
    });
    return filtered;
  }, [orders, searchTerm, selectedStatus, selectedPaymentMethod, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setCurrentPage(1);
  };

  // Calculate stats
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const pendingOrders = orders.filter((order) => order.status === 'Pending').length;
  const completedOrders = orders.filter((order) => order.status === 'Delivered').length;
  const totalOrders = orders.length;

  // Render order slip content dynamically
  const renderOrderSlip = (order) => {
    if (!order) return null;

    // ✅ Use backend-calculated values
    const subtotal = order.subtotal || 0;
    const shipping = order.shipping || 0;
    const discount = order.discount || 0;
    const total = order.total || 0;

    return (
      <div
        id="printable-slip"
        style={{
          position: 'absolute',
          left: '-9999px',
          width: '210mm',
          height: '297mm',
          fontFamily: 'Arial, sans-serif',
          background: '#fff',
          color: '#000',
        }}
      >
        <style>{`
        .order-slip {
          padding: 30px;
          font-size: 13px;
        }
        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #000;
          padding-bottom: 12px;
          margin-bottom: 24px;
        }
        .order-header .logo {
          font-size: 24px;
          font-weight: 900;
          letter-spacing: 2px;
        }
        .order-info {
          text-align: right;
        }
        .section-title {
          font-weight: 700;
          margin: 24px 0 12px;
          font-size: 16px;
          border-bottom: 1px solid #000;
          padding-bottom: 6px;
        }
        .address-block {
          display: flex;
          justify-content: space-between;
          gap: 40px;
        }
        .address {
          width: 50%;
        }
        .items-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 12px;
        }
        .items-table th,
        .items-table td {
          padding: 8px;
          border: 1px solid #ddd;
          font-size: 13px;
        }
        .items-table th {
          background: #000;
          color: white;
          text-align: left;
        }
        .summary {
          margin-top: 20px;
          width: 100%;
          max-width: 320px;
          float: right;
          border-top: 2px solid #000;
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 6px 0;
          border-bottom: 1px solid #ccc;
        }
        .summary-row:last-child {
          font-weight: 700;
          font-size: 15px;
          color: #0c8f45;
          border-bottom: none;
        }
        .discount-row {
          color: #b91c1c;
        }
        .footer {
          margin-top: 60px;
          border-top: 1px solid #ccc;
          padding-top: 20px;
          font-size: 12px;
          color: #555;
        }
      `}</style>

        <div className="order-slip">
          {/* Header */}
          <div className="order-header">
            <div className="logo">
              <img src='https://res.cloudinary.com/dvqgcj6wn/image/upload/v1750615825/panisho_logo__page-0001-removebg-preview_hdipnw.png' alt="Company Logo" />
            </div>
            <div className="order-info">
              <div><strong>Order ID:</strong> {order._id}</div>
              <div><strong>Date:</strong> {formatDate(order.createdAt)}</div>
            </div>
          </div>

          {/* Address Section */}
          <div className="address-block">
            <div className="address">
              <div className="section-title">Ship To</div>
              <div>{order.userId?.firstName} {order.userId?.lastName}</div>
              <div>{order.userId?.email}</div>
              <div>{order.userId?.phone}</div>
              <div style={{ marginTop: '8px' }}>
                {order.addressId?.street}<br />
                Landmark: {order.addressId?.landmark}<br />
                {order.addressId?.city}, {order.addressId?.state}<br />
                PIN: {order.addressId?.pincode}<br />
                India
              </div>
            </div>
            <div className="address">
              <div className="section-title">Ship From</div>
              <div>Panisho</div>
              <div>31 Reva Nagar</div>
              <div>Near South Zone Office, Udhana</div>
              <div>Surat – 394210, Gujarat</div>
              <div>Phone: +91 8160467524</div>
              <div>Email: Support@panisho.com</div>
            </div>
          </div>

          {/* Items Table */}
          <div className="section-title">Order Items</div>
          <table className="items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Variant</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, index) => (
                <tr key={index}>
                  <td>{item.productId?.name || 'Unknown Product'}</td>
                  <td>
                    {item.variant?.volume && item.variant?.volumeUnit
                      ? `${item.variant.volume} ${item.variant.volumeUnit}`
                      : 'N/A'}
                  </td>
                  <td>{item.quantity}</td>
                  <td>{formatPrice(item.variant?.sellingPrice || 0)}</td>
                  <td>{formatPrice((item.variant?.sellingPrice || 0) * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary */}
          <div className="summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>{formatPrice(shipping)}</span>
            </div>
            {discount > 0 && (
              <div className="summary-row discount-row">
                <span>Discount {order.coupon?.code ? `(${order.coupon.code})` : ''}</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="summary-row">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="footer">
            <div><strong>Customer Support:</strong> support@panisho.com | Mon–Sat, 9AM–7PM</div>
            <div><strong>Website:</strong> www.panisho.com</div>
            <div style={{ marginTop: '8px' }}>Thank you for your order with <strong>Panisho</strong>.</div>
          </div>
        </div>
      </div>
    );
  };


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
          <p className="text-gray-600 mt-1">Track and manage customer orders</p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin h-12 w-12 mx-auto text-blue-600">⌀</div>
          <p className="text-gray-600 mt-4">Loading orders...</p>
        </div>
      )}

      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-800">{totalOrders}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedOrders}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">{formatPrice(totalRevenue)}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {!isLoading && (
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID, user ID, or address ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-gray-600" />
              <select
                value={selectedPaymentMethod}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Payment Methods</option>
                {paymentMethodOptions.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="createdAt">Sort by Date</option>
                <option value="_id">Sort by Order ID</option>
                <option value="total">Sort by Amount</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="border border-gray-300 rounded-lg px-3 py-3 hover:bg-gray-50 transition-colors"
              >
                <ArrowUpDown className="h-5 w-5" />
              </button>
            </div>
            <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'table' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
              >
                <List className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
              >
                <Grid className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {!isLoading && viewMode === 'table' ? (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Order</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Payment</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedOrders.map((order) => {
                  const statusConfig = getStatusConfig(order.status);
                  const paymentConfig = getPaymentMethodConfig(order.paymentMethod);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-800">{order._id}</p>
                          <p className="text-sm text-gray-500">{order.items?.length || 0} items</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{formatDate(order.createdAt)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${paymentConfig.color}`}>
                          {paymentConfig.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-green-600">{formatPrice(order.total)}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsViewModalOpen(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setIsEditModalOpen(true);
                            }}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : !isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {paginatedOrders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const paymentConfig = getPaymentMethodConfig(order.paymentMethod);
            const StatusIcon = statusConfig.icon;

            return (
              <div key={order._id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{order._id}</h3>
                    <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusConfig.label}
                  </span>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payment:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${paymentConfig.color}`}>
                      {paymentConfig.label}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Items:</span>
                    <span className="font-medium">{order.items?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-semibold text-green-600 text-lg">{formatPrice(order.total)}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsViewModalOpen(true);
                    }}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setIsEditModalOpen(true);
                    }}
                    className="bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!isLoading && orders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No orders found</h3>
          <p className="text-gray-500">Orders will appear here when customers place them.</p>
        </div>
      )}

      {!isLoading && orders.length > 0 && filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No orders match your search</h3>
          <p className="text-gray-500">Try adjusting your search terms or filters.</p>
        </div>
      )}

      {!isLoading && filteredOrders.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center gap-2 mb-4 sm:mb-0">
            <span className="text-gray-600">Show</span>
            <select
              value={pageSize}
              onChange={handlePageSizeChange}
              className="border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="text-gray-600">of {filteredOrders.length} orders</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            {[...Array(Math.min(totalPages, 5))].map((_, index) => {
              const pageNumber = currentPage <= 3 ? index + 1 : currentPage - 2 + index;
              return pageNumber <= totalPages ? (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-2 border rounded-lg transition-colors ${currentPage === pageNumber ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-300 hover:bg-gray-50'}`}
                >
                  {pageNumber}
                </button>
              ) : null;
            })}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {isEditModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Update Order Status</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Order ID: {selectedOrder._id}</label>
              <select
                value={selectedOrder.status}
                onChange={(e) => setSelectedOrder({ ...selectedOrder, status: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdateStatus(selectedOrder._id, selectedOrder.status)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {isViewModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-black to-gray-800 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Order Details</h2>
                    <p className="text-gray-200">Complete order information</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-200 text-sm">Order ID</p>
                  <p className="text-white font-mono text-lg">{selectedOrder._id}</p>
                </div>
              </div>
            </div>
            <div className="p-8 overflow-y-auto flex-1" style={{ maxHeight: 'calc(90vh - 180px)' }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Tag className="w-5 h-5 mr-2 text-blue-600" />
                      Order Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-2">
                        <span className="text-gray-600 flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Order Date
                        </span>
                        <span className="font-medium text-gray-900">{formatDate(selectedOrder.createdAt)}</span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-gray-600">Status</span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusConfig(selectedOrder.status).color}`}>
                          {React.createElement(getStatusConfig(selectedOrder.status).icon, { className: "h-4 w-4 mr-2" })}
                          {getStatusConfig(selectedOrder.status).label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-gray-600">Total Amount</span>
                        <span className="text-2xl font-bold text-green-600">{formatPrice(selectedOrder.total)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                      Payment Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-2">
                        <span className="text-gray-600">Payment Method</span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentMethodConfig(selectedOrder.paymentMethod).color}`}>
                          {getPaymentMethodConfig(selectedOrder.paymentMethod).label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-gray-600">Payment Status</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedOrder.paymentStatus === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {selectedOrder.paymentStatus || 'Pending'}
                        </span>
                      </div>
                      {selectedOrder.invoiceUrl && (
                        <div className="pt-2">
                          <a
                            href={selectedOrder.invoiceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                          >
                            <Download className="h-4 w-4" />
                            Download Invoice
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                  {selectedOrder.userId && (
                    <div className="bg-purple-50 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <UserCircle className="w-5 h-5 mr-2 text-purple-600" />
                        Customer Information
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-2">
                          <span className="text-gray-600">Name</span>
                          <span className="font-medium text-gray-900">
                            {selectedOrder.userId.firstName} {selectedOrder.userId.lastName || ''}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="text-gray-600">Email</span>
                          <span className="font-medium text-gray-900">{selectedOrder.userId.email}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-6">
                  {selectedOrder.addressId && (
                    <div className="bg-orange-50 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Map className="w-5 h-5 mr-2 text-orange-600" />
                        Delivery Address
                      </h3>
                      <div className="bg-white rounded-xl p-4 border border-orange-100">
                        <div className="space-y-2">
                          <p className="font-medium text-gray-900">{selectedOrder.addressId.street}</p> 
                          <p className="font-medium text-gray-900">Landmark :- {selectedOrder.addressId.landmark}</p>

                          <p className="text-gray-600">
                            {selectedOrder.addressId.city}, {selectedOrder.addressId.state}
                          </p>
                          <p className="text-gray-600 font-mono">
                            PIN: {selectedOrder.addressId.pincode}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="bg-blue-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Package className="w-5 h-5 mr-2 text-blue-600" />
                      Order Items ({selectedOrder.items?.length || 0})
                    </h3>
                    <div className="space-y-3">
                      {selectedOrder.items?.map((item, index) => (
                        <div key={index} className="bg-white rounded-xl p-4 border border-blue-100">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 mb-1">
                                {item.productId?.name || 'Unknown Product'}
                              </h4>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span>Qty: {item.quantity}</span>
                                <span>Volume: {item.variant?.volume} {item.variant?.volumeUnit}</span>

                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-900">
                                {formatPrice((item.variant?.sellingPrice || 0) * item.quantity)}

                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-blue-200">
                      <div className="bg-white rounded-xl p-4">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-800">Order Total</span>
                          <span className="text-2xl font-bold text-green-600">{formatPrice(selectedOrder.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 px-8 py-6 bg-gray-50 flex-shrink-0">
              <div className="flex justify-end">
                <button
                  onClick={() => handleDownloadSlip(selectedOrder)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-lg flex items-center gap-2 mr-3"
                >
                  <Download className="h-5 w-5" />
                  Download Slip
                </button>
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setSelectedOrder(null);
                  }}
                  className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium text-lg flex items-center gap-2"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedOrder && renderOrderSlip(selectedOrder)}
    </div>
  );
};

export default OrderDisplay;