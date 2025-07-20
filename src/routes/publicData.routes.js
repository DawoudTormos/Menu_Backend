const express = require('express');
const router = express.Router();
const publicDataController = require('../controllers/publicData.controller');

router.get('/getRestaurantData/:ownerId', publicDataController.getRestaurantData);
router.get('/getItemsData/:ownerId', publicDataController.getItemsData);
router.get('/getTags', publicDataController.getTags);

module.exports = router;