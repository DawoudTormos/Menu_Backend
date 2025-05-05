const db = require('../config/db');

const createCategory = async (name, ownerId) => {
    try {
        if (!name) {
            return { success: false, code: 400, message: 'Category name is required' };
        }

        const result1 = await db.query(
            'select * from categories where name = $1 and owner_id = $2',
            [name, ownerId]
        );
        if (result1.rows[0]) {
            return { success: false, code: 400, message: 'Category name is already present.' };
        }

        const result2 = await db.query(
            'INSERT INTO categories (name, owner_id) VALUES ($1, $2) RETURNING *',
            [name, ownerId]
        );

        return { 
            success: true, 
            data: result2.rows[0],
            message: 'Category created successfully'
        };
    } catch (error) {
        throw error;
    }
};

const deleteCategory = async (categoryId, ownerId) => {
    try {
        // Verify category belongs to owner
        const verifyResult = await db.query(
            'SELECT * FROM categories WHERE id = $1 AND owner_id = $2',
            [categoryId, ownerId]
        );

        if (verifyResult.rows.length === 0) {
            return { 
                success: false, 
                code: 404, 
                message: 'Category not found or not owned by you' 
            };
        }

        // Check if category has items
        const itemsCheck = await db.query(
            'SELECT 1 FROM items WHERE category_id = $1 LIMIT 1',
            [categoryId]
        );

        if (itemsCheck.rows.length > 0) {
            return {
                success: false,
                code: 400,
                message: 'Cannot delete category with existing items'
            };
        }

        await db.query('DELETE FROM categories WHERE id = $1 AND owner_id = $2', [categoryId, ownerId]);

        return { success: true };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createCategory,
    deleteCategory
};