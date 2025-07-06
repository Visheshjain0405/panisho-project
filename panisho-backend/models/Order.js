const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  addressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: true
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      variant: {
        sku: String,
        volume: String,
        volumeUnit: String,
        mrp: Number,
        sellingPrice: Number,
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ],
  paymentMethod: {
    type: String,
    enum: ['card', 'upi', 'cod'],
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  },
  shipping: {
    type: Number,
    required: true
  },
  discount: { type: Number, default: 0 },
  coupon: {
    code: { type: String },
    discountAmount: { type: Number, default: 0 }
  },
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  invoiceUrl: {
    type: String,
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Pending'],
    default: 'Pending'
  },

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
