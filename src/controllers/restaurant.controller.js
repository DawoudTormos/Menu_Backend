const restaurantService = require('../services/restaurant.service');

const updateRestaurantDetails = async (req, res) => {
    try {
        const ownerId = req.owner.id;
        const { restaurantName } = req.body;

        const serviceResult = await restaurantService.updateRestaurantDetails(
            ownerId, 
            restaurantName
        );

        if (!serviceResult.success) {
            return res.status(serviceResult.code || 400).json({
                success: false,
                message: serviceResult.message
            });
        }

        res.status(200).json({
            success: true,
            data: serviceResult.data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const updateRestaurantLogo = async (req, res) => {
    try {
        const ownerId = req.owner.id;
        const logoFile = req.file; // From multer

        const serviceResult = await restaurantService.updateRestaurantLogo(
            ownerId, 
            logoFile
        );

        if (!serviceResult.success) {
            return res.status(serviceResult.code || 400).json({
                success: false,
                message: serviceResult.message
            });
        }

        res.status(200).json({
            success: true,
            data: serviceResult.data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    updateRestaurantDetails,
    updateRestaurantLogo
};