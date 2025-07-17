const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['home', 'office', 'other'], default: 'home' },
  name: String,
  street: String,
  city: String,
  state: String,
  pincode: String,
  phone: String,
  landmark: String, // Added landmark field
  isDefault: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Address', addressSchema);
