const publicDataService = require('../services/publicData.service');

const getRestaurantData = async (req, res) => {
    try {
        const ownerId = req.params.ownerId;
        const serviceResult = await publicDataService.getRestaurantData(ownerId);

        if(!serviceResult.success) {
            const code = serviceResult.code || 200;
            return res.status(code).json({
                success: false,
                code: code,
              message: serviceResult.message,
            });
          }

        res.status(200).json({
            success: true,
            data: serviceResult
        }); 
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const getItemsData = async (req, res) => {
    try {
        const ownerId = req.params.ownerId;
        const serviceResult = await publicDataService.getItemsData(ownerId);

        if(!serviceResult.success) {
            const code = serviceResult.code || 200;
            return res.status(code).json({
                success: false,
                code: code,
              message: serviceResult.message,
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
    getRestaurantData,
    getItemsData,
};