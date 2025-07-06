const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, default: 1 },

  variant: {
    sku: String,
    volume: String,
    volumeUnit: String,
    mrp: Number,
    sellingPrice: Number,
    stock: Number
  }
}, { timestamps: true });

// Optionally, export the model if not already done:
module.exports = mongoose.model('CartItem', cartItemSchema);
