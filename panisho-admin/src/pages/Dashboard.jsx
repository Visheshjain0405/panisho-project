//Updated Dasboard Component
// This component fetches and displays various statistics and charts for the admin dashboard.
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Package, ShoppingCart, Users, IndianRupee, Eye, Filter, Calendar } from 'lucide-react';
import Sidebar from '../component/common/Sidebar';
import api from '../api/axiosInstance';
const Dashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [orderFilter, setOrderFilter] = useState('all');

  const [statsData, setStatsData] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0
  });
  const [orderGraphData, setOrderGraphData] = useState([]);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await api.get('/dashboard/stats');
        setStatsData(data);
        setOrderGraphData(
          data.dailyChart.sort((a, b) => new Date(a.date) - new Date(b.date))
        );
        setOrderStatusData(
          data.orderStatusData.map(({ name, value }) => ({
            name,
            value,
            color: getRandomColor(name)
          }))
        );
        setMonthlyRevenueData(data.monthlyChart);
        setRecentOrders(data.recentOrders);
        setRecentReviews(data.recentReviews);
      } catch (err) {
        console.error('Dashboard fetch failed', err);
      }
    };

    fetchDashboardData();
  }, []);



  const getRandomColor = (status) => {
    const colors = {
      completed: '#10B981',
      pending: '#F59E0B',
      processing: '#3B82F6',
      shipped: '#8B5CF6',
      delivered: '#22C55E',
      cancelled: '#EF4444',
    };
    return colors[status?.toLowerCase()] || '#9CA3AF';  // convert to lowercase
  };





  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const StatCard = ({ title, value, icon: Icon, change, prefix = '' }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{prefix}{value}</p>
          {change && (
            <p className="text-sm text-green-600 mt-1 flex items-center">
              <TrendingUp className="w-4 h-4 mr-1" />
              +{change}% from last month
            </p>
          )}
        </div>
        <div className="p-3 bg-blue-50 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 ml-64"> {/* Adjust ml-64 based on your sidebar width */}
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </select>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Revenue"
              value={formatCurrency(statsData.totalRevenue)}
              icon={IndianRupee}
              change={12.5}
            />
            <StatCard
              title="Total Orders"
              value={statsData.totalOrders.toLocaleString('en-IN')}
              icon={ShoppingCart}
              change={8.2}
            />
            <StatCard
              title="Pending Orders"
              value={statsData.pendingOrders}
              icon={Package}
            />
            <StatCard
              title="Total Customers"
              value={statsData.totalCustomers.toLocaleString('en-IN')}
              icon={Users}
              change={15.3}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Daily Orders Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Daily Orders & Revenue</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    Orders
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    Revenue
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={orderGraphData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis yAxisId="left" stroke="#6b7280" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={12} />
                  <Tooltip
                    formatter={(value, name) => [
                      name === 'revenue' ? formatCurrency(value) : value,
                      name === 'revenue' ? 'Revenue' : 'Orders',
                    ]}
                  />
                  <Bar yAxisId="left" dataKey="orders" fill="#3b82f6" radius={4} />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Order Status Distribution */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || '#8884d8'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Orders']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-4 mt-4">
                {orderStatusData.map((status, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: status.color }}></div>
                    <span className="text-sm text-gray-600">{status.name}: {status.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Revenue Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `₹${value / 1000}K`} />
                <Tooltip formatter={(value) => [formatCurrency(value), 'Revenue']} />
                <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Orders</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{order.id}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{order.customer}</p>
                      <div className="flex items-center text-xs text-gray-500">
                        <span>{order.date}</span>
                        <span className="mx-2">•</span>
                        <span>{order.items} items</span>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-semibold text-gray-900">{formatCurrency(order.amount)}</p>
                      <button className="text-blue-600 text-sm hover:text-blue-700 mt-1 flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Reviews Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Product Reviews</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {recentReviews.length === 0 ? (
                  <p className="text-gray-500">No reviews yet.</p>
                ) : (
                  recentReviews.map((review, index) => (
                    <div key={index} className="p-4 border border-gray-100 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">{review.date}</p>
                      <p className="font-medium text-gray-900">
                        {review.user} rated <span className="text-yellow-500">{review.rating}★</span>
                      </p>
                      <p className="text-sm text-gray-700">"{review.comment}"</p>
                      <p className="text-xs text-gray-500">Product: {review.product}</p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>


        </div>
      </div>
    </div>
  );
};

export default Dashboard;