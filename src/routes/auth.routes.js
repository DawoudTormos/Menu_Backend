// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

router.post('/register', authController.register);
router.post('/login', authController.login);

router.post('/developer-reset-password', authController.developerResetPassword);

module.exports = router;