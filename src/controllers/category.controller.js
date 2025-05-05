const categoryService = require('../services/category.service');

const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const ownerId = req.owner.id;
        
        const serviceResult = await categoryService.createCategory(name, ownerId);

        if (!serviceResult.success) {
            return res.status(serviceResult.code || 400).json({
                success: false,
                message: serviceResult.message
            });
        }

        res.status(201).json({
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

const deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.id;
        const ownerId = req.owner.id;

        const serviceResult = await categoryService.deleteCategory(categoryId, ownerId);

        if (!serviceResult.success) {
            return res.status(serviceResult.code || 400).json({
                success: false,
                message: serviceResult.message
            });
        }

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    createCategory,
    deleteCategory
};