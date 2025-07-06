const Order = require('../models/Order');
const User = require('../models/User');
const Review = require('../models/Review');
const Product = require('../models/Product');

exports.getDashboardStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const matchStage = {};
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const orders = await Order.find(matchStage)
      .sort({ createdAt: -1 })
      .populate('userId', 'firstName email');

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const completedOrders = orders.filter(o => o.status === 'delivered').length;
    const totalCustomers = await User.countDocuments();
    const averageOrderValue = totalOrders ? Math.floor(totalRevenue / totalOrders) : 0;

    const orderGraphData = {};
    const monthlyRevenue = {};
    const statusCount = {};

    for (const o of orders) {
      const date = o.createdAt.toISOString().split('T')[0];
      const month = o.createdAt.toISOString().slice(0, 7);

      if (!orderGraphData[date]) orderGraphData[date] = { date, orders: 0, revenue: 0 };
      orderGraphData[date].orders++;
      orderGraphData[date].revenue += o.total;

      if (!monthlyRevenue[month]) monthlyRevenue[month] = { month, revenue: 0, orders: 0 };
      monthlyRevenue[month].revenue += o.total;
      monthlyRevenue[month].orders++;

      const status = o.status || 'unknown';
      statusCount[status] = (statusCount[status] || 0) + 1;
    }

    const recentOrders = orders.slice(0, 6).map(order => ({
      id: order._id,
      customer: order.userId?.firstName || 'Unknown',
      amount: order.total,
      date: order.createdAt.toISOString().split('T')[0],
      items: order.items?.length || 0,
      status: order.status
    }));

    const statusData = Object.entries(statusCount).map(([name, value]) => ({
      name,
      value,
      color:
        name === 'pending' ? '#F59E0B' :
        name === 'processing' ? '#3B82F6' :
        name === 'delivered' ? '#10B981' :
        name === 'cancelled' ? '#EF4444' :
        '#9CA3AF'
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

    res.status(200).json({
      totalRevenue,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalCustomers,
      averageOrderValue,
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
