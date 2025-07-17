const express = require('express');
const router = express.Router();
const { subscribe, getAllSubscribers } = require('../controllers/newsletterController');

router.post('/', subscribe);
router.get('/', getAllSubscribers); // optional, admin use

module.exports = router;
