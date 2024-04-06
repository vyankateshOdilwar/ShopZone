const mongoose = require('mongoose');

// Define the schema for the products collection
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 75
  },
  description: {
    type: String,
    required: true,
    maxlength: 250
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', // Reference to the Category model
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  image: {
    type: String,
    required: true
  },
  images: {
    type: [String],
    validate: [imagesArrayValidator, 'Images array must contain between 3 and 9 images']
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review' // Reference to the Review model
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Custom validator function for validating images array
function imagesArrayValidator(val) {
  return val.length >= 3 && val.length <= 9;
}

// Create a model for the "products" collection using the schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;