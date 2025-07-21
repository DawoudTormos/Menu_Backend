const itemService = require('../services/item.service');

const createItem = async (req, res) => {
  try {
    const { name, description, price, category_id, mainImageOriginalName } = req.body;
    const ownerId = req.owner.id;
    const images = req.files;

    const serviceResult = await itemService.createItem({
      name,
      description,
      price,
      category_id,
      ownerId,
      images,
      mainImageOriginalName
    });

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

const updateItem = async (req, res) => {
  try {
        const { name, description, price, category_id } = req.body;
    const itemId = req.params.id;
    const ownerId = req.owner.id;

    const serviceResult = await itemService.updateItem({
      itemId,
      name,
      description,
      price,
      category_id,
      ownerId,

    });

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
    console.error('Error updating item:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};



const updateItemImages = async (req, res) => {
  try {
    const itemId = req.params.id;
    const { mainImageOriginalName } = req.body;
    const ownerId = req.owner.id;
    const newImages = req.files;

    const serviceResult = await itemService.updateItemImages({
      itemId,
      ownerId,
      newImages,
      mainImageOriginalName,
      
    });

    if (!serviceResult.success) {
      return res.status(serviceResult.code || 400).json({
        success: false,
        message: serviceResult.message
      });
    }

    res.status(200).json({// 200 OK
      success: true,
      data: serviceResult.data
    });
  } catch (error) {
  console.error('Error updating item:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

const deleteItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const ownerId = req.owner.id;

    const serviceResult = await itemService.deleteItem(itemId, ownerId);

    if (!serviceResult.success) {
      return res.status(serviceResult.code || 400).json({
        success: false,
        message: serviceResult.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const deleteImage = async (req, res) => {
  try {
    const imageId = req.params.id;
    const ownerId = req.owner.id;

    const serviceResult = await itemService.deleteImage(imageId, ownerId);

    if (!serviceResult.success) {
      return res.status(serviceResult.code || 400).json({
        success: false,
        message: serviceResult.message
      });
    }

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  createItem,
  updateItem,
  deleteItem,
  deleteImage,
  updateItemImages
};