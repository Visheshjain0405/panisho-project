const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const productSchema = new mongoose.Schema({
  name: String,
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
  variants: [{
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
  }]
}, { timestamps: true });

// Auto-generate SKU before saving
productSchema.pre('save', function (next) {
  this.variants.forEach(variant => {
    if (!variant.sku) {
      variant.sku = `SKU-${uuidv4().slice(0, 8)}`; // Short UUID
    }
  });
  next();
});

module.exports = mongoose.model('Product', productSchema);
