// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

// Create an Express application
const app = express();
const port = process.env.PORT || 3000; // Use the provided port or default to 3000
// Add middleware to parse JSON bodies
const bodyParser = require('body-parser');
// Use body-parser middleware to parse JSON bodies
app.use(bodyParser.json());

// Use body-parser middleware to parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// MongoDB connection setup
require('./connection')();

// Define a route handler for the root path
app.use('/api/users',require('./routes/users/getUser'));
app.use('/api/users',require('./routes/users/postUser'));
app.use('/api/users',require('./routes/users/loginUser'));
app.use('/api/users',require('./routes/users/deleteUser'));
app.use('/api/users',require('./routes/users/updateUser'));
// product routes
app.use('/api/products',require('./routes/products/getProducts'));
app.use('/api/products',require('./routes/products/postProducts'));
app.use('/api/products',require('./routes/products/updateProducts'));
app.use('/api/products',require('./routes/products/deleteProducts'));
// cart routes
app.use('/api/carts',require('./routes/carts/getCart'));
app.use('/api/carts',require('./routes/carts/postCart'));
app.use('/api/carts',require('./routes/carts/deleteCart'));
app.use('/api/carts',require('./routes/carts/updateCart'));

// order routes
app.use('/api/orders',require('./routes/orders/getOrders'));
// payment routes
app.use('/api/payment',require('./routes/payments/payment'));

// ADMIN ROUTES
//orders
app.use('/api/admin',require('./routes/admin/orders/getOrdersAdmin'));
app.use('/api/admin',require('./routes/admin/orders/statusOrdersAdmin'));
//users
app.use('/api/admin',require('./routes/admin/users/getUsersAdmin'));
app.use('/api/admin',require('./routes/admin/users/deleteUsersAdmin'));


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
