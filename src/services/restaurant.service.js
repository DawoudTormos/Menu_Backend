const db = require('../config/db');
const path = require('path');
const fs = require('fs');

// Directory for storing logos
const LOGO_DIR = path.join(__dirname, '../images/ownerid/logo/');

// Ensure directory exists
if (!fs.existsSync(LOGO_DIR)) {
    fs.mkdirSync(LOGO_DIR, { recursive: true });
}

const updateRestaurantDetails = async (ownerId, restaurantName) => {
    try {
        if (!restaurantName) {
            return { success: false, code: 400, message: 'Restaurant name is required' };
        }

        const result = await db.query(
            'UPDATE owners SET restaurant_name = $1 WHERE id = $2 RETURNING id, restaurant_name, logo_path',
            [restaurantName, ownerId]
        );

        if (result.rowCount === 0) {
            return { success: false, code: 404, message: 'Owner not found' };
        }

        return { 
            success: true, 
            data: result.rows[0],
            message: 'Restaurant details updated successfully'
        };
    } catch (error) {
        throw error;
    }
};

const updateRestaurantLogo = async (ownerId, logoFile) => {
    try {
        // Validate input
        if (!logoFile) {
            return { success: false, code: 400, message: 'Logo file is required' };
        }

        // 1. Get current logo path from database
        const ownerResult = await db.query(
            'SELECT logo_path FROM owners WHERE id = $1',
            [ownerId]
        );

        if (ownerResult.rowCount === 0) {
            return { success: false, code: 404, message: 'Owner not found' };
        }

        const oldLogoPath = ownerResult.rows[0].logo_path;
        const newLogoFileName = logoFile.filename;

        // 2. Delete old logo file if exists and not default
        if (oldLogoPath && oldLogoPath !== 'nonset') {
            const oldLogoFullPath = path.join(
                __dirname, 
                '../../images', 
                ownerId.toString(), 
                'logo',
                oldLogoPath
            );
            
            try {
                if (fs.existsSync(oldLogoFullPath)) {
                    fs.unlinkSync(oldLogoFullPath);
                    //console.log(`Deleted old logo: ${oldLogoFullPath}`);
                }
            } catch (deleteError) {
                //console.error('Error deleting old logo:', deleteError);
                // Continue even if deletion fails
                throw new Error('Failed to delete old logo file');
            }
        }

        // 3. Update database with new filename
        const updateResult = await db.query(
            'UPDATE owners SET logo_path = $1 WHERE id = $2 RETURNING id, restaurant_name, logo_path',
            [newLogoFileName, ownerId]
        );

        return { 
            success: true, 
            data: updateResult.rows[0],
            message: 'Logo updated successfully'
        };
    } catch (error) {
        // Cleanup uploaded file on error
        if (logoFile?.path) {
            try {
                fs.unlinkSync(logoFile.path);
            } catch (cleanupErr) {
                console.error('Error cleaning up new logo file:', cleanupErr);
            }
        }
        throw error;
    }
};

module.exports = {
    updateRestaurantDetails,
    updateRestaurantLogo
};