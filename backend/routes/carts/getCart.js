const express = require('express');
const router = express.Router();
const Cart = require('../../models/carts'); // Assuming your Cart model is defined here
const authenticateToken = require('../../middleware/authenticateToken'); // Importing the authentication middleware

// GET request to retrieve the cart of the current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Find the cart of the current user
    const cart = await Cart.findOne({ userId: req.user.userId });

    // If the cart does not exist, send a 404 Not Found response
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Send the cart in the response
    res.status(200).json({ cart });
  } catch (error) {
    console.error('Error while fetching cart:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
