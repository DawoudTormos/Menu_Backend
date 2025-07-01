const path = require('path');
const fs = require('fs');

const IMAGES_DIR = path.join(__dirname, '../../images');

const getImage = (req, res) => {
  try {
    const { ownerId, categoryId, filename } = req.params;
    
    // Validate parameters
    if (!ownerId || !categoryId || !filename) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters'
      });
    }

    // Sanitize inputs to prevent directory traversal
    const safeOwnerId = ownerId.replace(/[^0-9]/g, '');
    const safeCategoryId= categoryId.replace(/[^0-9]/gi, '');
    const safeFilename = filename.replace(/[^a-z0-9_.-]/gi, '');

    if (safeOwnerId == "" || safeCategoryId == "" || safeFilename == "" ) {
      return res.status(403).json({ 
        success: false,
        message: 'Invalid characters in the route or malicous intent detected.'
      });
    }

    // Construct safe file path
    const filePath = path.join(
      IMAGES_DIR, 
      safeOwnerId, 
      safeCategoryId, 
      safeFilename
    );

    // Verify path is within allowed directory
    const resolvedPath = path.resolve(filePath);
    if (!resolvedPath.startsWith(IMAGES_DIR)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden path'
      });
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    // Send the image with proper headers
    const ext = path.extname(filePath).toLowerCase();
    const contentType = getContentType(ext);
    
    if (!contentType) {
      return res.status(400).json({
        success: false,
        message: 'Unsupported file type requested'
      });
    }

    res.setHeader('Content-Type', contentType);
    fs.createReadStream(filePath).pipe(res);
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper function to get content type
function getContentType(ext) {
  const types = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.webp': 'image/webp'
  };
  return types[ext] || null;
}

module.exports = {
  getImage
};