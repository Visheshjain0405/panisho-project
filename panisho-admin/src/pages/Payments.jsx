import React, { useState, useEffect } from 'react';
import Sidebar from '../component/common/Sidebar';
import api from '../api/axiosInstance';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Payments() {
  const [paymentData, setPaymentData] = useState({ orders: [], paymentTotals: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);
  const [filters, setFilters] = useState({
    paymentMethod: '',
    paymentStatus: '',
    startDate: '',
    endDate: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch payment data on component mount or filter change
  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/orders/payment-data', {
          params: {
            paymentMethod: filters.paymentMethod,
            paymentStatus: filters.paymentStatus,
            startDate: filters.startDate,
            endDate: filters.endDate,
          },
        });
        setPaymentData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load payment data');
        setLoading(false);
        console.error(err.response ? err.response.data : err.message);
      }
    };
    fetchPaymentData();
  }, [filters]);

  // Handle payment status update for COD orders
  const updatePaymentStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { paymentStatus: newStatus });
      setPaymentData((prev) => ({
        ...prev,
        orders: prev.orders.map((order) =>
          order._id === orderId ? { ...order, paymentStatus: newStatus } : order
        ),
      }));
      alert('Payment status updated successfully');
    } catch (err) {
      console.error('Error updating payment status:', err.response ? err.response.data : err.message);
      alert('Failed to update payment status');
    }
  };

  // Filter and search logic
  const filteredOrders = paymentData.orders.filter((order) => {
    const matchesSearch = order._id.toString().includes(searchTerm) ||
      (order.userId?.firstName + ' ' + order.userId?.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilters = 
      (!filters.paymentMethod || order.paymentMethod === filters.paymentMethod) &&
      (!filters.paymentStatus || order.paymentStatus === filters.paymentStatus) &&
      (!filters.startDate || new Date(order.createdAt) >= new Date(filters.startDate)) &&
      (!filters.endDate || new Date(order.createdAt) <= new Date(filters.endDate));
    return matchesSearch && matchesFilters;
  });

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Reset Filters
  const resetFilters = () => {
    setFilters({
      paymentMethod: '',
      paymentStatus: '',
      startDate: '',
      endDate: '',
    });
    setSearchTerm('');
  };

  // Export to CSV
  const exportToCSV = () => {
    const ws = XLSX.utils.json_to_sheet(filteredOrders.map(order => ({
      'Order ID': order._id,
      'Customer': `${order.userId?.firstName} ${order.userId?.lastName}`,
      'Payment Method': order.paymentMethod,
      'Amount': `₹${order.total.toLocaleString()}`,
      'Status': order.paymentStatus,
      'Date': new Date(order.createdAt).toLocaleDateString('en-GB'),
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Payments');
    const wbout = XLSX.write(wb, { bookType: 'csv', type: 'binary' });
    const blob = new Blob([s2ab(wbout)], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'payment_data.csv');
  };

  // Export to PDF
  const exportToPDF = () => {
    const { jsPDF } = require("jspdf");
    const doc = new jsPDF();
    doc.text('Payment Data Report', 10, 10);
    filteredOrders.forEach((order, index) => {
      doc.text(`Order ID: ${order._id}`, 10, 20 + index * 10);
      doc.text(`Customer: ${order.userId?.firstName} ${order.userId?.lastName}`, 10, 25 + index * 10);
      doc.text(`Method: ${order.paymentMethod}`, 10, 30 + index * 10);
      doc.text(`Amount: ₹${order.total.toLocaleString()}`, 10, 35 + index * 10);
      doc.text(`Status: ${order.paymentStatus}`, 10, 40 + index * 10);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-GB')}`, 10, 45 + index * 10);
    });
    doc.save('payment_data.pdf');
  };

  // Helper function for CSV export
  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  };

  // Chart Data
  const chartData = {
    labels: paymentData.paymentTotals.map(t => t.paymentMethod),
    datasets: [{
      label: 'Total Collection (₹)',
      data: paymentData.paymentTotals.map(t => t.totalAmount),
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Total Collection by Payment Method' },
    },
  };

  if (loading) return <div className="text-center p-6 text-gray-700">Loading...</div>;
  if (error) return <div className="text-center p-6 text-red-600">{error}</div>;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="md:w-64 w-full fixed md:static top-0 left-0 z-50 md:z-auto bg-white shadow-md">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-6 ml-0  mt-16 md:mt-0">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Payment Management</h1>

               {/* Payment Totals Card */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Total Collection Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {paymentData.paymentTotals.map((total, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h3 className="text-lg font-medium text-gray-600 capitalize">{total.paymentMethod}</h3>
                <p className="text-2xl font-bold text-gray-800">₹{total.totalAmount.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Orders: {total.count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6">
          <div className="h-64">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>

         {/* Filters and Search */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            <select
              value={filters.paymentMethod}
              onChange={(e) => setFilters({ ...filters, paymentMethod: e.target.value })}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            >
              <option value="">All Payment Methods</option>
              <option value="cod">Cash on Delivery</option>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
            </select>
            <select
              value={filters.paymentStatus}
              onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value })}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
            </select>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            />
            <button
              onClick={resetFilters}
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
            >
              Reset Filters
            </button>
          </div>
          <input
            type="text"
            placeholder="Search by Order ID, Customer, or Method..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={exportToCSV}
              className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-auto"
            >
              Export to CSV
            </button>
            <button
              onClick={exportToPDF}
              className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 w-full sm:w-auto"
            >
              Export to PDF
            </button>
          </div>
        </div>



        {/* Orders Table */}
        <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Transaction History</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  <th className="border-b border-gray-300 p-2 md:p-3 text-left">Order ID</th>
                  <th className="border-b border-gray-300 p-2 md:p-3 text-left">Customer</th>
                  <th className="border-b border-gray-300 p-2 md:p-3 text-left">Payment Method</th>
                  <th className="border-b border-gray-300 p-2 md:p-3 text-left">Amount (₹)</th>
                  <th className="border-b border-gray-300 p-2 md:p-3 text-left">Status</th>
                  <th className="border-b border-gray-300 p-2 md:p-3 text-left">Date</th>
                  <th className="border-b border-gray-300 p-2 md:p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="border-b border-gray-200 p-2 md:p-3">{order._id}</td>
                    <td className="border-b border-gray-200 p-2 md:p-3">
                      {order.userId?.firstName} {order.userId?.lastName}
                    </td>
                    <td className="border-b border-gray-200 p-2 md:p-3 capitalize">{order.paymentMethod}</td>
                    <td className="border-b border-gray-200 p-2 md:p-3">₹{order.total.toLocaleString()}</td>
                    <td className="border-b border-gray-200 p-2 md:p-3">{order.paymentStatus}</td>
                    <td className="border-b border-gray-200 p-2 md:p-3">
                      {new Date(order.createdAt).toLocaleDateString('en-GB')}
                    </td>
                    <td className="border-b border-gray-200 p-2 md:p-3">
                      {order.paymentMethod === 'cod' && order.paymentStatus === 'Pending' ? (
                        <select
                          value={order.paymentStatus}
                          onChange={(e) => updatePaymentStatus(order._id, e.target.value)}
                          className="border border-gray-300 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Paid">Paid</option>
                          <option value="Failed">Failed</option>
                          <option value="Refunded">Refunded</option>
                        </select>
                      ) : (
                        <span className="text-gray-500">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-4">
            <nav className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-2 md:px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-l-md hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-2 md:px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 ${
                    currentPage === number ? 'bg-blue-500 text-white' : 'bg-white'
                  }`}
                >
                  {number}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-2 md:px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-r-md hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payments;