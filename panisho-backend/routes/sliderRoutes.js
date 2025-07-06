const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  getAllSlides,
  createSlide,
  updateSlide,
  toggleSlideStatus,
  deleteSlide,
} = require('../controllers/sliderController');

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (['image/jpeg', 'image/png'].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG/PNG images are allowed'), false);
    }
  },
});

// Public routes
router.get('/', getAllSlides);
router.post('/create', upload.single('image'), createSlide);
router.put('/update/:id', upload.single('image'), updateSlide);
router.put('/status/:id', toggleSlideStatus);
router.delete('/delete/:id', deleteSlide);

module.exports = router;