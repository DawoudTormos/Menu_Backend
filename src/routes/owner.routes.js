// routes/owner.routes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
//const ownerController = require('../controllers/owner.controller');

router.use(authMiddleware.protect);

//router.get('/me', ownerController.getMe);

module.exports = router;