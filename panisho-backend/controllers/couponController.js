const Coupon = require('../models/Coupon');
const Order = require('../models/Order');
// GET /api/coupons - Get all coupons
exports.getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch coupons', details: err.message });
  }
};

// POST /api/coupons - Create a new coupon
exports.createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discount,
      type,
      minPurchase,
      maxDiscount,
      usageLimit,
      userLimit
    } = req.body;

    if (!code || !discount || !type) {
      return res.status(400).json({ error: 'Required fields missing (code, discount, type)' });
    }

    const coupon = new Coupon({
      code: code.toUpperCase().trim(),
      description,
      discount,
      type,
      minPurchase: minPurchase || null,
      maxDiscount: type === 'percentage' ? maxDiscount || null : null, // Only applicable to percentage
      usageLimit: usageLimit || null,
      userLimit: userLimit || null
    });

    await coupon.save();
    res.status(201).json(coupon);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create coupon', details: err.message });
  }
};

exports.applyCoupon = async (req, res) => {
  const { code, subtotal, userId } = req.body;

  try {
    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon || !coupon.isActive) {
      return res.status(400).json({ message: 'Invalid or inactive coupon' });
    }

    // ✅ Min purchase check
    if (coupon.minPurchase && subtotal < coupon.minPurchase) {
      return res.status(400).json({ message: `Minimum purchase of ₹${coupon.minPurchase} required` });
    }

    // ✅ Usage limit check
    const totalOrdersUsingCoupon = await Order.countDocuments({ 'coupon.code': coupon.code });
    if (coupon.usageLimit && totalOrdersUsingCoupon >= coupon.usageLimit) {
      return res.status(400).json({ message: 'Coupon usage limit reached' });
    }

    // ✅ Per-user usage limit
    const userOrdersUsingCoupon = await Order.countDocuments({ userId, 'coupon.code': coupon.code });
    if (coupon.userLimit && userOrdersUsingCoupon >= coupon.userLimit) {
      return res.status(400).json({ message: 'You have already used this coupon' });
    }

    // ✅ Calculate discount
    let discountAmount = 0;

    if (coupon.type === 'percentage') {
      discountAmount = (subtotal * coupon.discount) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else if (coupon.type === 'fixed') {
      discountAmount = coupon.discount;
    }

    return res.json({ coupon, discountAmount: Math.round(discountAmount) });

  } catch (err) {
    console.error('Apply coupon error:', err);
    return res.status(500).json({ message: 'Something went wrong while applying coupon' });
  }
};


// PUT /api/coupons/:id - Update a coupon
exports.updateCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discount,
      type,
      minPurchase,
      maxDiscount,
      usageLimit,
      userLimit
    } = req.body;

    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ error: 'Coupon not found' });

    coupon.code = code.toUpperCase().trim();
    coupon.description = description;
    coupon.discount = discount;
    coupon.type = type;
    coupon.minPurchase = minPurchase || null;
    coupon.maxDiscount = type === 'percentage' ? maxDiscount || null : null;
    coupon.usageLimit = usageLimit || null;
    coupon.userLimit = userLimit || null;

    await coupon.save();
    res.json(coupon);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update coupon', details: err.message });
  }
};

// DELETE /api/coupons/:id - Delete a coupon
exports.deleteCoupon = async (req, res) => {
  try {
    const deleted = await Coupon.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Coupon not found' });
    res.status(204).end(); // No content
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete coupon', details: err.message });
  }
};

// PATCH /api/coupons/:id/toggle - Toggle isActive
exports.toggleCouponStatus = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ error: 'Coupon not found' });

    coupon.isActive = !coupon.isActive;
    await coupon.save();
    res.json(coupon);
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle coupon status', details: err.message });
  }
};
