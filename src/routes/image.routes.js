const express = require('express');
const router = express.Router();
const imageController = require('../controllers/image.controller');

router.get('/logo/:ownerId/:filename', imageController.getLogoImage);
router.get('/:ownerId/:categoryId/:filename', imageController.getItemImage);

module.exports = router;