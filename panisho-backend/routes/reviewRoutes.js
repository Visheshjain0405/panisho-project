const express = require('express');
const router = express.Router();
const multer = require("multer");
const reviewController = require("../controllers/reviewController");

// Use memory storage instead of writing to disk
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.array("images", 4), reviewController.addReview);
router.get('/random', reviewController.getRandomPublicReviews);
router.get('/stats', reviewController.getReviewStats);

router.get("/:productId", reviewController.getReviewsByProduct);
router.get('/admin/reviews', reviewController.getAllReviews);
router.patch("/:id/admin-reply", reviewController.addAdminReply);


module.exports = router;
