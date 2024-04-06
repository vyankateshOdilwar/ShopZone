// routes/users.js

const express = require('express');
const router = express.Router();
const UsersController = require('../../controllers/usersController');

router.post('/', UsersController.createUser);

module.exports = router;
