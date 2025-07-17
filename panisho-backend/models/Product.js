const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const slugify = require('slugify');

const variantSchema = new mongoose.Schema({
  volume: String,
  volumeUnit: String,
  mrp: { type: Number, required: true },
  sellingPrice: { type: Number, required: true },
  stock: {
    type: Number,
    required: true,
    min: [1, 'Stock must be at least 1']
  },
  sku: { type: String, unique: true }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: {
    type: String,
    unique: true,
    required: true
  },
  description: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  images: [String],
  keywords: [String],
  ingredients: String,
  skinHairType: String,
  targetAudience: String,
  usageInstructions: String,
  displayOptions: [String],
  productTypes: [String],
  variants: [variantSchema]
}, { timestamps: true });

/**
 * Auto-generate SKU for variants and slug for product name before saving
 */
productSchema.pre('validate', function (next) {
  // Generate slug if not present
  if (!this.slug && this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }

  // Generate SKU if not provided
  this.variants.forEach(variant => {
    if (!variant.sku) {
      const base = slugify(this.name || 'product', { lower: true, strict: true });
      const vol = `${variant.volume}${variant.volumeUnit}`;
      variant.sku = `${base}-${vol}-${uuidv4().slice(0, 6)}`;
    }
  });

  next();
});

module.exports = mongoose.model('Product', productSchema);
