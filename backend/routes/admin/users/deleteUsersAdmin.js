const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../../../models/users'); // Assuming your User model is defined here
const Cart = require('../../../models/carts'); // Assuming your Cart model is defined here
const Order = require('../../../models/orders'); // Assuming your Order model is defined here
const authenticateToken = require('../../../middleware/authenticateToken'); // Importing the authentication middleware

// DELETE request to delete a user by ID (for admin)
router.delete('/users', authenticateToken, async (req, res) => {
  try {
    // Fetch the user from the database using the userId
    const user = await User.findById(req.user.userId);

    // Check if the user is an admin
    if (!user.roles.includes('admin')) {
      return res.status(403).json({ message: 'Forbidden: Only admins can access this resource' });
    }

    // Extract the userId from the request body
    const { userId } = req.body;

    // Check if the userId is a valid MongoDB ObjectId and has the correct length
    if (!mongoose.Types.ObjectId.isValid(userId) || userId.length !== 24) {
      return res.status(400).json({ message: 'Invalid userId' });
    }

    // Delete the user
    const deletedUser = await User.findByIdAndDelete(userId);

    // If the user does not exist, send a 404 Not Found response
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user's cart
    await Cart.deleteMany({ userId });

    // Delete the user's orders
    await Order.deleteMany({ userId });

    // Send a success message
    res.status(200).json({ message: 'User and related data deleted successfully' });
  } catch (error) {
    console.error('Error while deleting user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
