const express = require('express');
const router = express.Router();
const navbarCategoryController = require('../controllers/navbarCategoryController');

router.post('/', navbarCategoryController.createNavbarCategory);
router.get('/', navbarCategoryController.getNavbarCategories);

module.exports = router;