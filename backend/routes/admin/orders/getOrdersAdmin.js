const express = require('express');
const router = express.Router();
const Order = require('../../../models/orders'); // Assuming your Order model is defined here
const User = require('../../../models/users'); // Assuming your User model is defined here
const authenticateToken = require('../../../middleware/authenticateToken'); // Importing the authentication middleware

// GET request to retrieve orders based on status (for admin)
router.get('/orders', authenticateToken, async (req, res) => {
  try {
    // Fetch the user from the database using the userId
    const user = await User.findById(req.user.userId);

    // Check if the user is an admin
    if (!user.roles.includes('admin')) {
      return res.status(403).json({ message: 'Forbidden: Only admins can access this resource' });
    }

    // Extract the status from the request body
    const { status } = req.body;

    // Define a filter object based on the specified status (if provided)
    const filter = status ? { status } : {};

    // Query the database to find orders based on the filter
    const orders = await Order.find(filter);

    // If there are no orders found, send a 404 Not Found response
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }

    // If orders are found, send them in the response
    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error while fetching orders:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
