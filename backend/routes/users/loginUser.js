// routes/users.js

const express = require('express');
const router = express.Router();
const UsersController = require('../../controllers/usersController');

router.post('/login', UsersController.userLogin);

module.exports = router;
