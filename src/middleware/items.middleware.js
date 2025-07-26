// src/middleware/items.middleware.js
const db = require('../config/db');
const multer = require("multer");

const getItemCategory = async (req, res, next) => {
    try {
        const itemId = req.params.id;
        const ownerId = req.owner.id;

        const itemCheck = await db.query(
            `SELECT i.id, c.id as category_id 
             FROM items i 
             JOIN categories c ON i.category_id = c.id 
             WHERE i.id = $1 AND c.owner_id = $2`,
            [itemId, ownerId]
        );

        if (itemCheck.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Item not found or not owned by you"
            });
        }

        if ( req.body === undefined || req.body === null  ) {
            req.item = {};
            req.item.category_id = itemCheck.rows[0].category_id;
        } else {
            req.body.category_id = itemCheck.rows[0].category_id;
        }

        // Add category_id to request body  
        next();
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const checkCategoryOwnership = async (req, res, next) =>{
    try{

        const ownerId = req.owner.id;
        const {category_id} = req.body;

    const categoryCheck = await db.query(
      "SELECT 1 FROM categories WHERE id = $1 AND owner_id = $2",
      [category_id, ownerId]
    );

    if (!categoryCheck.rows.length) {
        res.status(400).json({
            success: false,
            message: "Invalid category"
        });
        return;
    }else{
        next();
    }

    }catch(error){
        res.status(505).json({
            success: false,
            error: error.message
        });
    }
}

module.exports = {
    getItemCategory,
    checkCategoryOwnership
};