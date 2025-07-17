// routes/authRoutes.js
const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

// Validation chains
const signupValidations = [
  body('firstName').notEmpty().withMessage('First name required'),
  body('lastName').notEmpty().withMessage('Last name required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('mobile').isMobilePhone().withMessage('Valid mobile number required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
];

const verifyEmailValidations = [
  body('email').isEmail().withMessage('Valid email required'),
  body('otp')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be 6 digits'),
];

const loginValidations = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').notEmpty().withMessage('Password required'),
];

// Routes
router.post('/signup', signupValidations, authController.signup);
router.post('/verify-email', verifyEmailValidations, authController.verifyEmail);

router.put('/change-password', protect, authController.changePassword);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.post('/login', loginValidations, authController.login);
// routes/authRoutes.js
router.get('/me', authController.getMe); // ✅ Add this

router.get('/', authController.getAllUsers);
router.post('/logout', authController.logout);


module.exports = router;
