const express = require('express');
const router = express.Router();
const Cart = require('../../models/carts');
const { isValidObjectId } = require('mongoose');
const authenticateToken = require('../../middleware/authenticateToken');

// PUT request to update product quantity in the cart by productId
router.put('/', authenticateToken, async (req, res) => {
  try {
    // Extract productId and new quantity from the request body
    const { productId, quantity } = req.body;

    // Check if productId and quantity are provided
    if (!productId || !quantity) {
      return res.status(400).json({ message: 'ProductId and quantity are required' });
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

    // Find the index of the product in the cart
    const index = cart.products.findIndex(item => item.product.toString() === productId);
    if (index === -1) {
      return res.status(404).json({ message: 'Product not found in cart' });
    }

    // Update the quantity of the product in the cart
    cart.products[index].quantity = quantity;
    await cart.save();

    // Send a success response
    res.status(200).json({ message: 'Product quantity updated in cart successfully' });
  } catch (error) {
    console.error('Error while updating product quantity in cart:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
