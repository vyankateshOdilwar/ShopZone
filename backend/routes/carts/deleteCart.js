const express = require('express');
const router = express.Router();
const Cart = require('../../models/carts');
const Product = require('../../models/products');
const { isValidObjectId } = require('mongoose');
const authenticateToken = require('../../middleware/authenticateToken');

// DELETE request to remove a product from the cart by productId
router.delete('/', authenticateToken, async (req, res) => {
  try {
    // Extract productId from the request body
    const { productId } = req.body;

    // Check if productId is provided
    if (!productId) {
      return res.status(400).json({ message: 'ProductId is required' });
    }

    // Check if productId is a valid ObjectId with 24 characters
    if (!isValidObjectId(productId)) {
      return res.status(400).json({ message: 'Invalid productId' });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }

    // Remove the product from the cart
    cart.products = cart.products.filter(item => item.product.toString() !== productId);
    await cart.save();

    // Send a success response
    res.status(200).json({ message: 'Product removed from cart successfully' });
  } catch (error) {
    console.error('Error while removing product from cart:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
