const mongoose = require('mongoose');

// Define the schema for the users collection
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    maxlength: 10 // Maximum of 10 characters for username
  },
  fullName: {
    type: String,
    required: true,
    maxlength: 15 // Maximum of 15 characters for fullName
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  postalCode: {
    type: String
  },
  city: {
    type: String
  },
  country: {
    type: String
  },
  roles: {
    type: [String],
    enum: ['admin', 'normal'],
    default: ['normal'] // Default role is 'normal'
  },
  // Change "orders" to store a single ObjectID referencing "Order" document
  orders: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order' // Reference to the Order model
  },
  // Change "cart" to store a single ObjectID referencing "Cart" document
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart' // Reference to the Cart model
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a model for the "users" collection using the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
