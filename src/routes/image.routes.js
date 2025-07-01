const express = require('express');
const router = express.Router();
const imageController = require('../controllers/image.controller');

router.get('/:ownerId/:categoryId/:filename', imageController.getImage);

module.exports = router;