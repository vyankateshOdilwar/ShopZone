// routes/products.js

const express = require('express');
const router = express.Router();
const ProductsController = require('../../controllers/productController');

router.get('/', ProductsController.getFilteredProducts);

module.exports = router;
