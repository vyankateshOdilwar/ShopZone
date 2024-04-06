const express = require('express');
const router = express.Router();
const Cart = require('../../models/carts');
const Product = require('../../models/products');
const User = require('../../models/users');
const authenticateToken = require('../../middleware/authenticateToken');

router.post('/', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { productId, quantity } = req.body;
    // Check if productId is a valid ObjectId with 24 characters
    if (!/^[0-9a-fA-F]{24}$/.test(productId)) {
        return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (quantity <= 0) {
      return res.status(400).json({ message: 'Invalid quantity' });
    }

    let cart = await Cart.findOne({ userId: req.user.userId });
    if (!cart) {
      cart = new Cart({
        userId: req.user.userId,
        products: []
      });
    }
    // Check if the product is already in the cart
    const existingProduct = cart.products.find(item => item.product.toString() === productId);
    if (existingProduct) {
      return res.status(400).json({ message: 'Product is already in the cart' });
    }
    
    cart.products.push({ product: productId, quantity });
    await cart.save();

    res.status(201).json({ message: 'Product added to cart successfully' });
  } catch (error) {
    console.error('Error while adding product to cart:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
