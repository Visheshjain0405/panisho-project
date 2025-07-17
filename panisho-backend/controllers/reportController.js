// reportController.js
const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

exports.getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const matchStage = {};
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const orders = await Order.find(matchStage).sort({ createdAt: 1 });

    const salesData = {};
    for (const order of orders) {
      const date = order.createdAt.toISOString().split('T')[0];
      if (!salesData[date]) {
        salesData[date] = { date, orders: 0, revenue: 0 };
      }
      salesData[date].orders += 1;
      salesData[date].revenue += order.total;
    }

    const result = Object.values(salesData).map(row => ({
      date: row.date,
      orders: row.orders,
      revenue: row.revenue,
      avgOrderValue: row.orders ? Math.round(row.revenue / row.orders) : 0
    }));

    res.json(result);
  } catch (err) {
    console.error('❌ Sales Report Error:', err);
    res.status(500).json({ message: 'Failed to generate sales report' });
  }
};

exports.getPaymentReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const matchStage = {};
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const orders = await Order.find(matchStage).populate('userId', 'firstName');

    const payments = orders.map(order => ({
      transactionId: order._id,
      customer: order.userId?.firstName || 'Unknown',
      amount: order.total,
      status: order.paymentStatus || 'unpaid',
      method: order.paymentMethod || 'N/A',
      date: order.createdAt.toISOString().split('T')[0]
    }));

    res.json(payments);
  } catch (err) {
    console.error('❌ Payment Report Error:', err);
    res.status(500).json({ message: 'Failed to generate payment report' });
  }
};

exports.getProductReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const matchStage = {};
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const orders = await Order.find(matchStage).populate('items.productId');

    const productStats = {};

    for (const order of orders) {
      for (const item of order.items || []) {
        const product = item.productId;
        if (!product || !product._id) continue;

        const id = product._id.toString();

        if (!productStats[id]) {
          productStats[id] = {
            product: product.name || 'Unnamed Product',
            category: product.category || 'Uncategorized',
            unitsSold: 0,
            revenue: 0,
            stock: product.stock || 0
          };
        }

        productStats[id].unitsSold += item.quantity;
        productStats[id].revenue += item.quantity * (item.price || product.price || 0);
      }
    }

    res.json(Object.values(productStats));
  } catch (err) {
    console.error('❌ Product Report Error:', err);
    res.status(500).json({ message: 'Failed to generate product report' });
  }
};

exports.getSummaryReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const matchStage = {};
    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const orders = await Order.find(matchStage).populate('userId');

    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalOrders = orders.length;
    const uniqueCustomers = [...new Set(orders.map(order => order.userId?._id?.toString()))].length;
    const avgOrderValue = totalOrders ? Math.round(totalRevenue / totalOrders) : 0;

    res.json({
      totalRevenue,
      totalOrders,
      avgOrderValue,
      uniqueCustomers
    });
  } catch (err) {
    console.error('❌ Summary Report Error:', err);
    res.status(500).json({ message: 'Failed to generate summary report' });
  }
};