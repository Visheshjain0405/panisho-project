const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');

router.get('/', couponController.getAllCoupons);
router.post('/', couponController.createCoupon);
router.post('/apply', couponController.applyCoupon);
router.put('/:id', couponController.updateCoupon);
router.delete('/:id', couponController.deleteCoupon);
router.patch('/:id/toggle', couponController.toggleCouponStatus);

module.exports = router;
