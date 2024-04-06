const mongoose = require('mongoose');

// Define the schema for the carts collection
const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product', // Reference to the Product model
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a model for the "carts" collection using the schema
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
