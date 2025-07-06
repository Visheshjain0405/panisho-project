// routes/wishlistRoutes.js
const express = require('express');
const  protect  = require('../middleware/authMiddleware');
const wishlistController = require('../controllers/wishlistController');

const router = express.Router();
router.use(protect);

router
    .route('/')
    .get(wishlistController.getWishlist)
    .post(wishlistController.addToWishlist);

router.delete('/:productId', wishlistController.removeFromWishlist);

module.exports = router;
