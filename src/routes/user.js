const express = require('express');
const router = express.Router();

const userController = require('../app/controllers/UserController');

router.get('/name', userController.name);

module.exports = router;