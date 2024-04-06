const express = require('express');
const router = express.Router();
const Order = require('../../models/orders');
const authenticateToken = require('../../middleware/authenticateToken');

// GET request to retrieve orders of the current user
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Find orders for the current user
    const orders = await Order.find({ userId: req.user.userId });

    // If no orders are found, send a 404 Not Found response
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for the user' });
    }

    // If orders are found, send them in the response
    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error while fetching orders:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
