// controllers/authController.js
require('dotenv').config();
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Order = require('../models/Order'); // Make sure this is imported
const transporter = require('../config/mailer');
const crypto = require('crypto');

// Utility: sign a JWT for a given user ID
const signToken = (userId) =>
    jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

// Email Template Functions
const createOTPEmailTemplate = (otp, firstName) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Panisho Account</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); min-height: 100vh;">
        <!-- Main Container -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); min-height: 100vh;">
            <tr>
                <td align="center" style="padding: 40px 20px;">
                    <!-- Email Card -->
                    <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; box-shadow: 0 20px 60px rgba(236, 72, 153, 0.15); overflow: hidden;">
                        
                        <!-- Header with Logo -->
                        <tr>
                            <td style="padding: 60px 50px 40px; text-align: center; background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%);">
                                <!-- Logo Section -->
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                        <td align="center" style="padding-bottom: 30px;">
                                            <img src="https://res.cloudinary.com/dvqgcj6wn/image/upload/v1750615825/panisho_logo__page-0001-removebg-preview_hdipnw.png" 
                                                 alt="Panisho Logo" 
                                                 width="200" 
                                                 height="200" 
                                                 style="display: block; max-width: 200px; height: auto;">
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Main Content Section -->
                        <tr>
                            <td style="padding: 60px 50px; text-align: center;">
                                <!-- Security Icon -->
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                        <td align="center">
                                            <div style="width: 100px; height: 100px; background: linear-gradient(135deg, #ec4899, #f472b6); border-radius: 50%; margin: 0 auto 40px; position: relative; box-shadow: 0 15px 40px rgba(236, 72, 153, 0.3);">
                                                <table width="100%" height="100%" cellpadding="0" cellspacing="0" border="0">
                                                    <tr>
                                                        <td align="center" valign="middle">
                                                            <span style="font-size: 40px; color: #ffffff; display: block; text-align: center;">🔐</span>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Title -->
                                <h2 style="color: #1a1a1a; margin: 0 0 20px; font-size: 32px; font-weight: 600; letter-spacing: -0.5px;">
                                    Email Verification Required
                                </h2>

                                <!-- Description -->
                                <p style="color: #666666; margin: 0 0 50px; font-size: 18px; line-height: 1.6; max-width: 450px; margin-left: auto; margin-right: auto;">
                                    Hello <strong>${firstName || 'there'}</strong>! Please enter the verification code below to activate your Panisho account and start your premium beauty journey.
                                </p>

                                <!-- OTP Container -->
                                <div style="background: linear-gradient(135deg, #fdf2f8, #fce7f3); border: 3px solid #ec4899; border-radius: 20px; padding: 40px; margin: 0 auto 40px; max-width: 400px; box-shadow: 0 10px 30px rgba(236, 72, 153, 0.15);">
                                    <p style="color: #ec4899; margin: 0 0 20px; font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">
                                        Your Verification Code
                                    </p>
                                    
                                    <!-- OTP Display -->
                                    <div style="background-color: #ffffff; border-radius: 16px; padding: 30px; border: 2px solid #f9a8d4; box-shadow: inset 0 2px 8px rgba(236, 72, 153, 0.1);">
                                        <div style="font-size: 48px; font-weight: 700; color: #ec4899; letter-spacing: 15px; font-family: 'Courier New', monospace; text-align: center;">
                                            ${otp}
                                        </div>
                                    </div>
                                    
                                    <p style="color: #666666; margin: 25px 0 0; font-size: 14px;">
                                        <strong>⏱️ This code expires in 15 minutes</strong>
                                    </p>
                                </div>

                                <!-- Info Box -->
                                <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border-left: 5px solid #f59e0b; border-radius: 12px; padding: 25px; margin: 40px auto 0; max-width: 500px; text-align: left;">
                                    <h4 style="color: #92400e; margin: 0 0 10px; font-size: 18px; font-weight: 600;">
                                        🌟 What happens next?
                                    </h4>
                                    <p style="color: #92400e; margin: 0; font-size: 16px; line-height: 1.5;">
                                        After verification, you'll unlock access to our premium skincare collection, exclusive member discounts, and personalized beauty recommendations tailored just for you.
                                    </p>
                                </div>
                            </td>
                        </tr>

                        <!-- Features Section -->
                        <tr>
                            <td style="padding: 0 50px 50px; background-color: #fafafa;">
                                <h3 style="color: #1a1a1a; margin: 0 0 35px; font-size: 24px; font-weight: 600; text-align: center;">
                                    Why Choose Panisho?
                                </h3>
                                
                                <!-- Features Grid -->
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                        <!-- Feature 1 -->
                                        <td width="33.33%" style="padding: 0 10px 0 0; text-align: center; vertical-align: top;">
                                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                <tr>
                                                    <td>
                                                        <div style="background-color: #ffffff; border-radius: 16px; padding: 25px 15px; border: 2px solid #fce7f3; box-shadow: 0 8px 25px rgba(236, 72, 153, 0.1); text-align: center; min-height: 180px;">
                                                            <div style="font-size: 36px; margin-bottom: 15px; text-align: center;">🌸</div>
                                                            <h4 style="color: #1a1a1a; margin: 0 0 10px; font-size: 18px; font-weight: 600; text-align: center;">Premium Quality</h4>
                                                            <p style="color: #666666; margin: 0; font-size: 14px; line-height: 1.4; text-align: center;">Carefully curated skincare products for radiant skin</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                        
                                        <!-- Feature 2 -->
                                        <td width="33.33%" style="padding: 0 5px; text-align: center; vertical-align: top;">
                                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                <tr>
                                                    <td>
                                                        <div style="background-color: #ffffff; border-radius: 16px; padding: 25px 15px; border: 2px solid #fce7f3; box-shadow: 0 8px 25px rgba(236, 72, 153, 0.1); text-align: center; min-height: 180px;">
                                                            <div style="font-size: 36px; margin-bottom: 15px; text-align: center;">🛡️</div>
                                                            <h4 style="color: #1a1a1a; margin: 0 0 10px; font-size: 18px; font-weight: 600; text-align: center;">Trusted Brand</h4>
                                                            <p style="color: #666666; margin: 0; font-size: 14px; line-height: 1.4; text-align: center;">Thousands of satisfied customers worldwide</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                        
                                        <!-- Feature 3 -->
                                        <td width="33.33%" style="padding: 0 0 0 10px; text-align: center; vertical-align: top;">
                                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                <tr>
                                                    <td>
                                                        <div style="background-color: #ffffff; border-radius: 16px; padding: 25px 15px; border: 2px solid #fce7f3; box-shadow: 0 8px 25px rgba(236, 72, 153, 0.1); text-align: center; min-height: 180px;">
                                                            <div style="font-size: 36px; margin-bottom: 15px; text-align: center;">🌿</div>
                                                            <h4 style="color: #1a1a1a; margin: 0 0 10px; font-size: 18px; font-weight: 600; text-align: center;">Chemical-Free Products</h4>
                                                            <p style="color: #666666; margin: 0; font-size: 14px; line-height: 1.4; text-align: center;">Natural ingredients for safe and effective skincare</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="padding: 40px 50px; background-color: #1a1a1a; text-align: center;">
                                <p style="color: #ffffff; margin: 0 0 15px; font-size: 18px; font-weight: 300;">
                                    Need assistance? We're here to help.
                                </p>
                                <p style="margin: 0 0 25px;">
                                    <a href="mailto:support@panisho.com" style="color: #f472b6; text-decoration: none; font-weight: 500; font-size: 16px;">
                                        support@panisho.com
                                    </a>
                                </p>
                                <div style="border-top: 1px solid #333333; padding-top: 25px;">
                                    <p style="color: #888888; margin: 0; font-size: 14px;">
                                        © 2025 Panisho. All rights reserved.
                                    </p>
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};

const createWelcomeEmailTemplate = (firstName) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Panisho!</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); min-height: 100vh;">
        <!-- Main Container -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); min-height: 100vh;">
            <tr>
                <td align="center" style="padding: 40px 20px;">
                    <!-- Email Card -->
                    <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; box-shadow: 0 20px 60px rgba(236, 72, 153, 0.15); overflow: hidden;">
                        
                        <!-- Header with Logo -->
                        <tr>
                            <td style="padding: 60px 50px 40px; text-align: center; background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%);">
                                <!-- Logo Section -->
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                        <td align="center" style="padding-bottom: 30px;">
                                            <img src="https://res.cloudinary.com/dvqgcj6wn/image/upload/v1750615825/panisho_logo__page-0001-removebg-preview_hdipnw.png" 
                                                 alt="Panisho Logo" 
                                                 width="150" 
                                                 height="150" 
                                                 style="display: block; max-width: 150px; height: auto;">
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center">
                                            <!-- Brand Header -->
                                            <div style="position: relative; display: inline-block;">
                                                <!-- Decorative top line -->
                                                <div style="width: 120px; height: 2px; background: rgba(255,255,255,0.6); margin: 0 auto 25px;"></div>
                                                
                                                <!-- Welcome Text -->
                                                <h1 style="color: #ffffff; margin: 0; font-size: 44px; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; text-shadow: 0 4px 8px rgba(0,0,0,0.2);">
                                                    WELCOME TO PANISHO
                                                </h1>
                                                
                                                <!-- Subtitle -->
                                                <p style="color: rgba(255,255,255,0.9); margin: 20px 0; font-size: 20px; font-weight: 300; letter-spacing: 1px;">
                                                    Your premium beauty journey begins now!
                                                </p>
                                                
                                                <!-- Decorative bottom line -->
                                                <div style="width: 120px; height: 2px; background: rgba(255,255,255,0.6); margin: 25px auto 0;"></div>
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Success Message -->
                        <tr>
                            <td style="padding: 60px 50px 40px; text-align: center;">
                                <!-- Success Icon -->
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <tr>
                                        <td align="center">
                                            <div style="width: 120px; height: 120px; background: linear-gradient(135deg, #ec4899, #f472b6); border-radius: 50%; margin: 0 auto 40px; position: relative; box-shadow: 0 20px 50px rgba(236, 72, 153, 0.3);">
                                                <table width="100%" height="100%" cellpadding="0" cellspacing="0" border="0">
                                                    <tr>
                                                        <td align="center" valign="middle">
                                                            <span style="font-size: 50px; color: #ffffff; font-weight: bold; display: block; text-align: center;">✓</span>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </td>
                                    </tr>
                                </table>

                                <!-- Congratulations -->
                                <h2 style="color: #1a1a1a; margin: 0 0 20px; font-size: 36px; font-weight: 600; letter-spacing: -0.5px;">
                                    Congratulations, ${firstName}!
                                </h2>

                                <!-- Success Message -->
                                <p style="color: #666666; margin: 0 0 50px; font-size: 20px; line-height: 1.6; max-width: 480px; margin-left: auto; margin-right: auto;">
                                    Your Panisho account has been successfully verified. You're now part of our exclusive premium beauty community.
                                </p>
                            </td>
                        </tr>

                        <!-- CTA Section -->
                        <tr>
                            <td style="padding: 0 50px 50px;">
                                <div style="background: linear-gradient(135deg, #fdf2f8, #fce7f3); border: 3px solid #f9a8d4; border-radius: 20px; padding: 40px; text-align: center;">
                                    <h3 style="color: #1a1a1a; margin: 0 0 20px; font-size: 28px; font-weight: 600;">
                                        Start Your Beauty Journey
                                    </h3>
                                    <p style="color: #666666; margin: 0 0 35px; font-size: 18px; line-height: 1.6; max-width: 420px; margin-left: auto; margin-right: auto;">
                                        Explore our carefully curated collection of premium skincare and haircare products designed to enhance your natural beauty.
                                    </p>
                                    
                                    <!-- CTA Button -->
                                    <a href="https://panisho.com" style="display: inline-block; background: linear-gradient(135deg, #ec4899, #f472b6); color: #ffffff; text-decoration: none; padding: 20px 50px; border-radius: 50px; font-weight: 700; font-size: 20px; letter-spacing: 1px; box-shadow: 0 10px 30px rgba(236, 72, 153, 0.4); transition: all 0.3s ease;">
                                        SHOP NOW
                                    </a>
                                </div>
                            </td>
                        </tr>

                        <!-- Product Categories -->
                        <tr>
                            <td style="padding: 0 50px 50px; background-color: #fafafa;">
                                <h3 style="color: #1a1a1a; margin: 0 0 40px; font-size: 28px; font-weight: 600; text-align: center;">
                                    Our Premium Collection
                                </h3>
                                
                                <!-- Products Grid -->
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                    <!-- Row 1 -->
                                    <tr>
                                        <td width="50%" style="padding: 0 10px 30px 0;">
                                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                <tr>
                                                    <td>
                                                        <div style="background-color: #ffffff; border-radius: 16px; padding: 30px 20px; border: 2px solid #fce7f3; box-shadow: 0 8px 25px rgba(236, 72, 153, 0.1); text-align: center; min-height: 200px;">
                                                            <div style="font-size: 48px; margin-bottom: 20px; text-align: center;">🧴</div>
                                                            <h4 style="color: #1a1a1a; margin: 0 0 12px; font-size: 22px; font-weight: 600; text-align: center;">Skin Care</h4>
                                                            <p style="color: #666666; margin: 0; font-size: 16px; line-height: 1.4; text-align: center;">Premium products for radiant, healthy skin</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                        <td width="50%" style="padding: 0 0 30px 10px;">
                                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                <tr>
                                                    <td>
                                                        <div style="background-color: #ffffff; border-radius: 16px; padding: 30px 20px; border: 2px solid #fce7f3; box-shadow: 0 8px 25px rgba(236, 72, 153, 0.1); text-align: center; min-height: 200px;">
                                                            <div style="font-size: 48px; margin-bottom: 20px; text-align: center;">💇‍♀️</div>
                                                            <h4 style="color: #1a1a1a; margin: 0 0 12px; font-size: 22px; font-weight: 600; text-align: center;">Hair Care</h4>
                                                            <p style="color: #666666; margin: 0; font-size: 16px; line-height: 1.4; text-align: center;">Nourishing shampoo & conditioner for beautiful hair</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                    <!-- Row 2 -->
                                    <tr>
                                        <td width="50%" style="padding: 0 10px 0 0;">
                                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                <tr>
                                                    <td>
                                                        <div style="background-color: #ffffff; border-radius: 16px; padding: 30px 20px; border: 2px solid #fce7f3; box-shadow: 0 8px 25px rgba(236, 72, 153, 0.1); text-align: center; min-height: 200px;">
                                                            <div style="font-size: 48px; margin-bottom: 20px; text-align: center;">🧔</div>
                                                            <h4 style="color: #1a1a1a; margin: 0 0 12px; font-size: 22px; font-weight: 600; text-align: center;">Beard Care</h4>
                                                            <p style="color: #666666; margin: 0; font-size: 16px; line-height: 1.4; text-align: center;">Premium beard oil for grooming perfection</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                        <td width="rem 0;">
                                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                                <tr>
                                                    <td>
                                                        <div style="background-color: #ffffff; border-radius: 16px; padding: 30px 20px; border: 2px solid #fce7f3; box-shadow: 0 8px 25px rgba(236, 72, 153, 0.1); text-align: center; min-height: 200px;">
                                                            <div style="font-size: 48px; margin-bottom: 20px; text-align: center;">💄</div>
                                                            <h4 style="color: #1a1a1a; margin: 0 0 12px; font-size: 22px; font-weight: 600; text-align: center;">All Types Cosmetics</h4>
                                                            <p style="color: #666666; margin: 0; font-size: 16px; line-height: 1.4; text-align: center;">Luxury makeup for every style and occasion</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                            <td style="padding: 40px 50px; background-color: #1a1a1a; text-align: center;">
                                <p style="color: #ffffff; margin: 0 0 15px; font-size: 20px; font-weight: 300;">
                                    Thank you for choosing Panisho
                                </p>
                                <p style="margin: 0 0 25px;">
                                    <a href="mailto:support@panisho.com" style="color: #f472b6; text-decoration: none; font-weight: 500; font-size: 16px;">
                                        support@panisho.com
                                    </a>
                                </p>
                                <!-- Social Media Section -->
                              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 25px;">
                                    <tr>
                                        <td align="center">
                                            <h4 style="color: #ffffff; margin: 0 0 20px; font-size: 18px; font-weight: 600;">
                                                Follow Us
                                            </h4>
                                            <table cellpadding="0" cellspacing="0" border="0" style="display: inline-block;">
                                                <tr>
                                                    <td style="padding: 0 10px;">
                                                        <a href="https://wa.me/1234567890" style="text-decoration: none;">
                                                            <img src="https://res.cloudinary.com/dvqgcj6wn/image/upload/v1730034562/whatsapp-icon.png" alt="WhatsApp" style="width: 24px; height: 24px; display: block;">
                                                        </a>
                                                    </td>
                                                    <td style="padding: 0 10px;">
                                                        <a href="https://instagram.com/panisho" style="text-decoration: none;">
                                                            <img src="https://res.cloudinary.com/dvqgcj6wn/image/upload/v1730034562/instagram-icon.png" alt="Instagram" style="width: 24px; height: 24px; display: block;">
                                                        </a>
                                                    </td>
                                                    <td style="padding: 0 10px;">
                                                        <a href="https://facebook.com/panisho" style="text-decoration: none;">
                                                            <img src="https://res.cloudinary.com/dvqgcj6wn/image/upload/v1730034562/facebook-icon.png" alt="Facebook" style="width: 24px; height: 24px; display: block;">
                                                        </a>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                                <div style="border-top: 1px solid #333333; padding-top: 25px;">
                                    <p style="color: #888888; margin: 0; font-size: 14px;">
                                        © 2025 Panisho. All rights reserved.
                                    </p>
                                </div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
};

/**
 * @desc    Register new user (send email OTP)
 * @route   POST /api/auth/signup
 * @access  Public
 */
exports.signup = async (req, res, next) => {
    try {
        // 1) Validate inputs
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        const { firstName, lastName, email, mobile, password } = req.body;
        console.log('Signup request:', { firstName, lastName, email, mobile });

        // 2) Prevent duplicate email
        if (await User.findOne({ email })) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        // 3) Hash password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4) Create unverified user
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            mobile,
            password: hashedPassword,
        });

        // 5) Generate 6-digit OTP, expires in 15 minutes
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        newUser.emailOTP = {
            code: otp,
            expiresAt: Date.now() + 15 * 60 * 1000,
        };
        await newUser.save();

        // 6) Send OTP email with beautiful template
        await transporter.sendMail({
            from: `"Panisho Beauty" <${process.env.EMAIL_USER}>`,
            to: newUser.email,
            subject: '🌸 Verify your Panisho account - Premium Beauty Awaits',
            html: createOTPEmailTemplate(otp, firstName),
        });

        // 7) Respond with pending status
        res.status(201).json({
            status: 'pending',
            message: 'OTP sent to email. Please verify to complete registration.',
        });
    } catch (err) {
        console.error('Signup error:', err);
        next(err);
    }
};

/**
 * @desc    Verify email OTP & complete signup
 * @route   POST /api/auth/verify-email
 * @access  Public
 */
exports.verifyEmail = async (req, res, next) => {
    try {
        // 1) Validate inputs
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        const { email, otp } = req.body;
        console.log('Verification attempt:', { email, otp });

        // 2) Find user, include OTP & verification fields
        const user = await User.findOne({ email }).select(
            '+emailOTP.code +emailOTP.expiresAt +isVerified'
        );
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.isVerified)
            return res.status(400).json({ message: 'Email already verified' });

        // 3) Check OTP validity
        if (
            user.emailOTP.code !== otp ||
            user.emailOTP.expiresAt < Date.now()
        ) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // 4) Mark user verified & clear OTP
        user.isVerified = true;
        user.emailOTP = undefined;
        await user.save();

        // 5) Send welcome email with beautiful template
        await transporter.sendMail({
            from: `"Panisho Beauty" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: '🌸 Welcome to Panisho - Your Premium Beauty Journey Begins!',
            html: createWelcomeEmailTemplate(user.firstName),
        });

        // 6) Issue JWT & set cookie
        const token = signToken(user._id);
        res
            .cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 1000 * 60 * 60 * 24 * 7, // ✅ 7 days
            })
            .status(200)
            .json({
                status: 'success',
                token,
                data: {
                    user: {
                        id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        mobile: user.mobile,
                    },
                },
            });
    } catch (err) {
        console.error('Verification error:', err);
        next(err);
    }
};

/**
 * @desc    Login existing user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
    try {
        // 1) Validate inputs
        const errors = validationResult(req);
        if (!errors.isEmpty())
            return res.status(400).json({ errors: errors.array() });

        const { email, password } = req.body;
        console.log('Login attempt:', { email });

        // 2) Find user & ensure email verified
        const user = await User.findOne({ email }).select(
            '+password +isVerified'
        );
        if (!user)
            return res.status(401).json({ message: 'Invalid credentials' });
        if (!user.isVerified)
            return res
                .status(401)
                .json({ message: 'Please verify your email first.' });

        // 3) Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ message: 'Invalid credentials' });

        // 4) Issue JWT & set cookie
        const token = signToken(user._id);
        // Login and verify-email controllers:
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days, match JWT expiry
        })
        .status(200)
        .json({
                status: 'success',
                token,
                data: {
                    user: {
                        id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        mobile: user.mobile,
                    },
                },
            });
    } catch (err) {
        console.error('Login error:', err);
        next(err);
    }
};


// GET /api/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -emailOTP');

    // Aggregate orders grouped by userId
    const orderStats = await Order.aggregate([
      {
        $group: {
          _id: '$userId',
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$total' },
        },
      },
    ]);

    // Convert to a map for easy lookup
    const statsMap = {};
    orderStats.forEach((stat) => {
      statsMap[stat._id.toString()] = {
        totalOrders: stat.totalOrders,
        totalSpent: stat.totalSpent,
      };
    });

    // Combine users with order stats
    const enrichedUsers = users.map((user) => {
      const stats = statsMap[user._id.toString()] || { totalOrders: 0, totalSpent: 0 };
      return {
        ...user.toObject(),
        totalOrders: stats.totalOrders,
        totalSpent: stats.totalSpent,
      };
    });

    res.status(200).json(enrichedUsers);
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({ message: 'Error fetching users', error });
  }
};



exports.getMe = async (req, res) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: 'Not logged in' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'User no longer exists' });
        }

        res.status(200).json({ user });
    } catch (err) {
        console.error('getMe error:', err);
        return res.status(401).json({ message: 'Session expired or invalid' });
    }
};

exports.logout = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ status: 'success', message: 'Logged out' });
};

/**
 * @desc    Change current user password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // 1) Fetch user with password
    const user = await User.findById(userId).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 2) Check if current password is valid
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    // 3) Hash and update password
    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ message: 'Failed to change password' });
  }
};

/**
 * @desc    Send password reset email
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'Email not found' });

    // Generate a secure reset token (not JWT)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await transporter.sendMail({
      to: user.email,
      from: `"Panisho Support" <${process.env.EMAIL_USER}>`,
      subject: 'Reset your password - Panisho',
      html: `<p>Click the link below to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 15 minutes.</p>`,
    });

    res.status(200).json({ message: 'Reset link sent to email' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Failed to send reset link' });
  }
};

/**
 * @desc    Reset user password
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: 'Token is invalid or expired' });

    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(req.body.password, salt);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Failed to reset password' });
  }
};

