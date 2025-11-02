const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  title: String,
  code: { type: String, unique: true },
  description: String,
  discountPercent: Number, // e.g., 10 for 10%
  active: { type: Boolean, default: true },
  validFrom: Date,
  validTo: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Offer', offerSchema);
