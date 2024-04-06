const express = require('express');
const router = express.Router();
const Order = require('../../../models/orders'); // Assuming your Order model is defined here
const User = require('../../../models/users'); // Assuming your User model is defined here
const authenticateToken = require('../../../middleware/authenticateToken'); // Importing the authentication middleware

// POST request to update order status (for admin)
router.put('/orders', authenticateToken, async (req, res) => {
  try {
    // Fetch the user from the database using the userId
    const user = await User.findById(req.user.userId);

    // Check if the user is an admin
    if (!user.roles.includes('admin')) {
      return res.status(403).json({ message: 'Forbidden: Only admins can access this resource' });
    }

    // Extract orderId from the request body
    const { orderId } = req.body;

    // Find the order by orderId
    const order = await Order.findById(orderId);

    // If order not found, return error
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Define order status progression
    const statusProgression = ['pending', 'approved', 'processing', 'shipped', 'delivered'];

    // Get the index of current status in the progression array
    const currentStatusIndex = statusProgression.indexOf(order.status);

    // If current status is the last status, return without updating
    if (currentStatusIndex === statusProgression.length - 1) {
      return res.status(400).json({ message: 'Order status cannot be updated further' });
    }

    // Update the order status to the next status in the progression
    const nextStatus = statusProgression[currentStatusIndex + 1];
    order.status = nextStatus;

    // Save the updated order to the database
    await order.save();

    // Send success response
    res.status(200).json({ message: 'Order status updated successfully', updatedOrder: order });
  } catch (error) {
    console.error('Error while updating order status:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
