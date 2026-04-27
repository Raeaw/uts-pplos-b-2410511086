const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Endpoint GET
router.get('/google', authController.googleLogin);
router.get('/google/callback', authController.googleCallback);

// Endpoint POST
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/logout', authController.logout);

module.exports = router;