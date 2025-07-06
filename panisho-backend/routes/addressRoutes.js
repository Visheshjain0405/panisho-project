const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');
const requireAuth = require('../middleware/authMiddleware');

router.use(requireAuth);

router.get('/', addressController.getAddresses);
router.post('/', addressController.saveAddress);
router.put('/:id', addressController.updateAddress);


module.exports = router;
