const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 }
  }],
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved','processing', 'shipped', 'delivered'], default: 'pending' },
  address: { type: String, required: true },
  customerId: { type: String, required: true } // Add customId field
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
