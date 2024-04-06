// routes/productRoutes.js

const express = require('express');
const router = express.Router();
const ProductController = require('../../controllers/productController');
const authenticateToken = require('../../middleware/authenticateToken');

router.put('/', authenticateToken, ProductController.updateProduct);

module.exports = router;
