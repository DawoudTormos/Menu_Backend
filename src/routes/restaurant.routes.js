const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurant.controller');
const { protect } = require('../middleware/auth.middleware');
const { upload, handleUploadErrors } = require('../utils/fileUpload');

// Update restaurant details
router.put('/details', protect, restaurantController.updateRestaurantDetails);
// Update restaurant logo
router.put('/logo', protect, upload.single('logo'), handleUploadErrors, restaurantController.updateRestaurantLogo);

module.exports = router;