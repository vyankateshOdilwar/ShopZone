const User = require('../models/users');
const Product = require('../models/products');

exports.getFilteredProducts = async (req, res) => {
  try {
    const { productsCount, category, priceLowerThan, priceHigherThan } = req.body;

    const filter = {};
    if (category) filter.category = category;
    if (priceLowerThan) filter.price = { $lt: priceLowerThan };
    if (priceHigherThan) filter.price = { ...filter.price, $gt: priceHigherThan };

    let query = Product.find(filter).limit(productsCount);

    const products = await query.exec();

    if (!products || products.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }

    res.status(200).json({ products });
  } catch (error) {
    console.error('Error while fetching products:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// POST PRODUCT


exports.createProduct = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user.roles.includes('admin')) {
      return res.status(403).json({ message: 'Forbidden: Only admins can create products' });
    }

    const { name, category, price, description, image, images } = req.body;

    if (!name || !category || !price || !description || !image || !images) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newProduct = new Product({
      name,
      category,
      price,
      description,
      image,
      images
    });

    await newProduct.save();

    res.status(201).json({ message: 'Product created successfully', product: newProduct });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation Error', errors });
    }

    console.error('Error while creating product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// UPDATE PRODUCT

exports.updateProduct = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user.roles.includes('admin')) {
      return res.status(403).json({ message: 'Forbidden: Only admins can update products' });
    }

    const { productId, name, category, price, description, image, images } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (name) product.name = name;
    if (category) product.category = category;
    if (price) product.price = price;
    if (description) product.description = description;
    if (image) product.image = image;
    if (images) product.images = images;

    await product.save();

    res.status(200).json({ message: 'Product updated successfully', product });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation Error', errors });
    }

    console.error('Error while updating product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// DELETE PRODUCT

exports.deleteProduct = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user.roles.includes('admin')) {
      return res.status(403).json({ message: 'Forbidden: Only admins can delete products' });
    }

    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error while deleting product:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
