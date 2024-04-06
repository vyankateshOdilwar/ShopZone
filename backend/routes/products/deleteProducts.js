// routes/productRoutes.js

const express = require('express');
const router = express.Router();
const ProductController = require('../../controllers/productController');
const authenticateToken = require('../../middleware/authenticateToken');

router.delete('/', authenticateToken, ProductController.deleteProduct);

module.exports = router;
