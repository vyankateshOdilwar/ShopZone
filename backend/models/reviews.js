const mongoose = require('mongoose');

// Define the schema for the reviews collection
const reviewSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Reference to the Product model
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    maxlength: 250 // Max length of the comment
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a model for the "reviews" collection using the schema
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;