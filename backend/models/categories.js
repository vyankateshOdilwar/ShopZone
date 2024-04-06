const mongoose = require('mongoose');

// Define the schema for the categories collection
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a model for the "categories" collection using the schema
const Category = mongoose.model('categories', categorySchema);

module.exports = Category;