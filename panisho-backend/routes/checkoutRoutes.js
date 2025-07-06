const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');
const protect = require('../middleware/authMiddleware');

router.use(protect);

router.post('/place-order', checkoutController.placeOrder);
router.post('/place-buynow', checkoutController.placeBuyNowOrder);
router.post('/create-razorpay-order', checkoutController.createRazorpayOrder);
router.post('/verify', checkoutController.verifyPayment);
router.post('/send-whatsapp', checkoutController.sendWhatsAppConfirmation);

module.exports = router;