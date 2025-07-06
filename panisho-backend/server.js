// server.js
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitizeRaw = require('express-mongo-sanitize');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const cloudinary = require('cloudinary').v2;

const connectDB = require('./config/db');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/auth');
const wishlistRoutes = require('./routes/wishlistRoutes');
const cartRoutes = require("./routes/cartRoutes")
const checkoutRoutes = require("./routes/checkoutRoutes")
const addressRoutes = require("./routes/addressRoutes")
const orderRoutes = require('./routes/orderRoutes');
const couponRoutes = require('./routes/couponRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const sliderRoutes = require('./routes/sliderRoutes');
const contactRoutes=require('./routes/contactRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const { errorHandler } = require('./middleware/errorHandler');
const protect = require('./middleware/authMiddleware')

const app = express();
connectDB();

// CORS (allow your React at :3001 + cookies)
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://192.168.0.167:3001', 'https://panisho-project.vercel.app'],
  credentials: true
}));



// Security headers
app.use(helmet());

// Body & Cookie parsing
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// NoSQL injection sanitize (body & params only)
app.use((req, res, next) => {
  if (req.body) req.body = mongoSanitizeRaw.sanitize(req.body);
  if (req.params) req.params = mongoSanitizeRaw.sanitize(req.params);
  next();
});

// Rate limiter
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10),
  max: parseInt(process.env.RATE_LIMIT_MAX, 10),
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

// Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', protect, cartRoutes)
app.use('/api/checkout', checkoutRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/slider', sliderRoutes); // Slider routes
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/contact',contactRoutes)

// Fallback error handler (valid 3-digit status code)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: 'Something went wrong!', error: err.message });
});

// Optional centralized errorHandler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
