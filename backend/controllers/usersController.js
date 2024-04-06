const User = require('../models/users');
const Cart = require('../models/carts');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
  try {
    const { username, fullName, email, password, address } = req.body;

    if (!username || !fullName || !email || !password) {
      return res.status(400).json({ message: 'Username, fullName, email, and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      fullName,
      email,
      password: hashedPassword,
      address
    });

    const savedUser = await newUser.save();

    const newCart = new Cart({ userId: newUser._id });
    await newCart.save();

    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// USER LOGIN
exports.userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }
  
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Incorrect password' });
      }
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.status(200).json({ token });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };

exports.getUserData = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error while fetching user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update User

exports.updateUserData = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { fullName, email, address, username } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.address = address || user.address;
    user.username = username || user.username;

    await user.save();

    res.status(200).json({ message: 'User data updated successfully', user });
  } catch (error) {
    console.error('Error while updating user data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete User

// controllers/usersController.js

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.body.userId;

    if (userId !== req.user.userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await Cart.findOneAndDelete({ userId });

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error while deleting user:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
