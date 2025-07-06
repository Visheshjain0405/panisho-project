// routes/productRoutes.js

const express = require('express');
const router = express.Router();
const multer = require('multer');
const productController = require('../controllers/productController');

// Configure Multer for in-memory storage (so we can pipe buffers directly to Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(file.originalname.toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Images only!'));
    }
  },
});

// Routes:
// POST   /api/products/        → createProduct (with up to 4 images)
// GET    /api/products/        → getAllProducts
// GET    /api/products/:id     → getProductById
// PUT    /api/products/:id     → updateProduct (with up to 4 images)
// DELETE /api/products/:id     → deleteProduct

router.post('/', upload.array('images', 4), productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', upload.array('images', 4), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/category/:slug', productController.getProductsByCategorySlug);

module.exports = router;
