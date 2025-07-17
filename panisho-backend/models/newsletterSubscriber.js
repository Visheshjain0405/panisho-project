const mongoose = require('mongoose');

const newsletterSubscriber = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('NewsletterSubscriber', newsletterSubscriber);
