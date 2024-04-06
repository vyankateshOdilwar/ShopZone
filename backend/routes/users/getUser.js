const express = require('express');
const router = express.Router();
const UsersController = require('../../controllers/usersController');
const authenticateToken = require('../../middleware/authenticateToken');

router.get('/', authenticateToken, UsersController.getUserData);

module.exports = router;
