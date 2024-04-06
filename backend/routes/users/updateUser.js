// routes/users.js

const express = require('express');
const router = express.Router();
const UsersController = require('../../controllers/usersController');
const authenticateToken = require('../../middleware/authenticateToken');

router.put('/', authenticateToken, UsersController.updateUserData);

module.exports = router;
