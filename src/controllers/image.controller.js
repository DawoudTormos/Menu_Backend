const path = require('path');
const fs = require('fs');

const IMAGES_DIR = path.join(__dirname, '../../images');

// Helper function to validate and sanitize parameters
const sanitizeParams = (params) => {
    const { ownerId, filename, categoryId } = params;
    const errors = [];
    
    // Validate ownerId (digits only)
    if (!/^\d+$/.test(ownerId)) {
        errors.push('Invalid ownerId format');
    }
    
    // Validate filename (safe characters)
    if (!/^[\w.-]+$/.test(filename)) {
        errors.push('Invalid filename format');
    }
    
    // For categoryId (if present)
    if (categoryId && !/^\d+$/.test(categoryId)) {
        errors.push('Invalid categoryId format');
    }
    
    return errors.length ? errors : null;
};

// Common image serving function
const serveImage = (filePath, res) => {
    //console.log(`Serving image from: ${filePath}`);
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
    return fs.createReadStream(filePath).pipe(res);
};

// Get item image (with category)
const getItemImage = (req, res) => {
    try {
        const { ownerId, categoryId, filename } = req.params;
        
        // Validate parameters
        const errors = sanitizeParams({ ownerId, categoryId, filename });
        if (errors) {
            return res.status(403).json({ 
                success: false,
                message: 'Invalid parameters',
                errors
            });
        }

        // Construct file path
        const filePath = path.join(
            IMAGES_DIR, 
            ownerId, 
            categoryId, 
            filename
        );

        return serveImage(filePath, res);
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get logo image (no category)
const getLogoImage = (req, res) => {
    try {
        const { ownerId, filename } = req.params;
        
        // Validate parameters
        const errors = sanitizeParams({ ownerId, filename });
        if (errors) {
            return res.status(403).json({ 
                success: false,
                message: 'Invalid parameters',
                errors
            });
        }

        // Construct file path
        const filePath = path.join(
            IMAGES_DIR, 
            ownerId, 
            'logo',
            filename
        );

        return serveImage(filePath, res);
        
    } catch (error) {
        return res.status(500).json({
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
    getItemImage,
    getLogoImage
};