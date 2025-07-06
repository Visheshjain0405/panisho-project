// controllers/wishlistController.js
const User = require('../models/User');

// GET /api/wishlist
exports.getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('wishlist');
    res.status(200).json({ status: 'success', data: user.wishlist });
  } catch (err) {
    next(err);
  }
};

// POST /api/wishlist
// body: { productId }
exports.addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};

// DELETE /api/wishlist/:productId
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    await User.findByIdAndUpdate(
      req.user.id,
      { $pull: { wishlist: productId } },
      { new: true }
    );
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
