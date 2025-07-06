const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.REVIEW_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.REVIEW_CLOUDINARY_API_KEY,
  api_secret: process.env.REVIEW_CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
