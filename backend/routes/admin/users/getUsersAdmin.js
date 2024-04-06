const express = require('express');
const router = express.Router();
const User = require('../../../models/users'); // Assuming your User model is defined here
const authenticateToken = require('../../../middleware/authenticateToken'); // Importing the authentication middleware

// GET request to retrieve users based on filters (for admin)
router.get('/users', authenticateToken, async (req, res) => {
  try {
    // Fetch the user from the database using the userId
    const user = await User.findById(req.user.userId);

    // Check if the user is an admin
    if (!user.roles.includes('admin')) {
      return res.status(403).json({ message: 'Forbidden: Only admins can access this resource' });
    }

    // Extract filters from the request body
    const { usersCount, country, city, roles } = req.body;

    // Define the filter object
    const filter = {};

    // Apply filters if provided
    if (country) filter.country = country;
    if (city) filter.city = city;
    if (roles) filter.roles = roles;

    // Query the database to find users based on the filter
    let query = User.find(filter).limit(usersCount);

    // Execute the query
    const users = await query.exec();

    // If no users found, send a 404 Not Found response
    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    // If users are found, send them in the response
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error while fetching users:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
