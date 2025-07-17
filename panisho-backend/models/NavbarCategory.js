const mongoose = require('mongoose');

const navbarCategorySchema = new mongoose.Schema({
  navbarCategory: {
    type: String,
    required: true,
    enum: ['Beauty Products', 'Hair Products'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('NavbarCategory', navbarCategorySchema);