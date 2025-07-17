const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const protect = require('../middleware/authMiddleware'); // or adjust path if needed


router.get('/my-orders', protect, orderController.getMyOrders);
router.get('/payment-data', orderController.getPaymentData);
router.get('/top-selling-products', orderController.getTopSellingProducts);

router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.delete('/:id', orderController.deleteOrder);
router.patch('/:id/status', orderController.updateOrderStatus);

module.exports = router;