// server/models/Category.js
const mongoose = require('mongoose');
const slugify = require('slugify');

const CategorySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, unique: true },
  image: { type: String, required: true },
  slug: { type: String, required: true, unique: true }
}, { timestamps: true });

// Auto-generate slug from title on save
CategorySchema.pre('validate', function(next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Category', CategorySchema);
