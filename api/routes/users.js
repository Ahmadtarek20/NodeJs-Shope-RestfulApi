const express = require('express');
const router = express.Router();
const cheakAuth = require('../middeleware/check-auth');
const UserController = require('../controllers/users');


router.post('/signup', UserController.user_signup);

router.post('/login', UserController.user_login);

router.delete('/:userId', cheakAuth, UserController.user_deleted);

module.exports = router;