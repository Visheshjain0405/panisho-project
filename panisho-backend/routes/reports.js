// reportsRoutes.js
const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/reportController');

router.get('/sales', ReportController.getSalesReport);
router.get('/payment', ReportController.getPaymentReport);
router.get('/products', ReportController.getProductReport);
router.get('/summary', ReportController.getSummaryReport);

module.exports = router;