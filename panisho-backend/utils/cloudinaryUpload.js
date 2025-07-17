const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

// Load Cloudinary credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a PDF buffer to Cloudinary in the 'invoices/' folder
 * and saves it with a .pdf extension
 * 
 * @param {Buffer} buffer - PDF buffer
 * @param {string} filename - Filename (without .pdf)
 * @returns {Promise<string>} - Public URL of uploaded PDF
 */
exports.uploadPDFBufferToCloudinary = (buffer, filename) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'auto',
        upload_preset: 'public_raw_invoice',
        public_id: `invoices/${filename}`, // e.g. invoices/invoice-12345
        format: 'pdf',
        type: 'upload',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url); // now public and inline-viewable
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};



exports.uploadImageToCloudinary = (buffer, filename) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        public_id: `slider_images/${filename}`,
        folder: 'slider_images',
        format: 'jpg', // or 'png' based on your needs
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};
