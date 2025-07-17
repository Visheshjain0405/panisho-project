const Order = require('../models/Order');
const User = require('../models/User');
const Review = require('../models/Review');
const Product = require('../models/Product');

exports.getDashboardStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Filters
    const matchStage = startDate && endDate
      ? { createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) } }
      : { createdAt: { $gte: startOfThisMonth } };

    const prevMatchStage = startDate && endDate
      ? {
          createdAt: {
            $gte: new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() - 1)),
            $lte: new Date(new Date(endDate).setMonth(new Date(endDate).getMonth() - 1))
          }
        }
      : { createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } };

    // Get filtered orders
    const orders = await Order.find(matchStage).sort({ createdAt: -1 }).populate('userId', 'firstName email');
    const lastMonthOrders = await Order.find(prevMatchStage);

    // Full order set for monthly chart
    const allOrders = await Order.find().sort({ createdAt: 1 });

    // Totals
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const lastRevenue = lastMonthOrders.reduce((sum, o) => sum + o.total, 0);

    const totalOrders = orders.length;
    const lastOrderCount = lastMonthOrders.length;

    const totalCustomers = await User.countDocuments(matchStage);
    const customersLastMonth = await User.countDocuments(prevMatchStage);

    const pendingOrders = orders.filter(o => o.status?.toLowerCase() === 'pending').length;

    const averageOrderValue = totalOrders ? Math.floor(totalRevenue / totalOrders) : 0;

    const calcChange = (curr, prev) =>
      prev === 0 ? 100 : parseFloat(((curr - prev) / prev) * 100).toFixed(1);

    const revenueChange = calcChange(totalRevenue, lastRevenue);
    const ordersChange = calcChange(totalOrders, lastOrderCount);
    const customersChange = calcChange(totalCustomers, customersLastMonth);

    // Daily Chart
    const orderGraphData = {};
    const statusCount = {};

    for (const o of orders) {
      const date = o.createdAt.toISOString().split('T')[0];

      if (!orderGraphData[date]) orderGraphData[date] = { date, orders: 0, revenue: 0 };
      orderGraphData[date].orders++;
      orderGraphData[date].revenue += o.total;

      const status = o.status || 'unknown';
      statusCount[status] = (statusCount[status] || 0) + 1;
    }

    // Monthly Revenue Chart (from ALL orders)
    const monthlyRevenue = {};
    for (const o of allOrders) {
      const month = o.createdAt.toISOString().slice(0, 7);
      if (!monthlyRevenue[month]) monthlyRevenue[month] = { month, revenue: 0 };
      monthlyRevenue[month].revenue += o.total;
    }

    const statusData = Object.entries(statusCount).map(([name, value]) => ({
      name,
      value,
      color:
        name.toLowerCase() === 'pending' ? '#F59E0B' :
        name.toLowerCase() === 'processing' ? '#3B82F6' :
        name.toLowerCase() === 'delivered' ? '#22C55E' :
        name.toLowerCase() === 'cancelled' ? '#EF4444' :
        '#9CA3AF'
    }));

    const recentOrders = orders.slice(0, 6).map(order => ({
      id: order._id,
      customer: order.userId?.firstName || 'Unknown',
      amount: order.total,
      date: order.createdAt.toISOString().split('T')[0],
      items: order.items?.length || 0,
      status: order.status
    }));

    const rawReviews = await Review.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .populate('userId', 'firstName')
      .populate('productId', 'name');

    const recentReviews = rawReviews.map(r => ({
      user: r.userId?.firstName || 'Anonymous',
      product: r.productId?.name || 'Unknown Product',
      rating: r.rating,
      comment: r.comment,
      date: r.createdAt.toISOString().split('T')[0]
    }));

    // Final response
    res.status(200).json({
      totalRevenue,
      totalOrders,
      pendingOrders,
      totalCustomers,
      averageOrderValue,
      revenueChange,
      ordersChange,
      customersChange,
      dailyChart: Object.values(orderGraphData),
      monthlyChart: Object.values(monthlyRevenue),
      orderStatusData: statusData,
      recentOrders,
      recentReviews
    });
  } catch (err) {
    console.error("❌ Dashboard stats error:", err);
    res.status(500).json({ message: 'Failed to load dashboard stats' });
  }
};
