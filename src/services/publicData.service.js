const db = require('../config/db');

const getRestaurantData = async (ownerId) => {
    const query = `
        SELECT o.restaurant_name, o.logo_path, ct.name as color_theme_name, ct.data as color_theme_data
        FROM owners o
        JOIN color_themes ct ON o.color_theme_id = ct.id
        WHERE o.id = $1
    `;
    const result = await db.query(query, [ownerId]);
    if (result.rows.length === 0) {
        return {success: false, code: 404, message: 'Restaurant not found'}
    }
    
    // Parse the color theme JSON data
    const restaurantData = result.rows[0];
    restaurantData.color_theme = {
        name: restaurantData.color_theme_name,
        colors: JSON.parse(restaurantData.color_theme_data)
    };
    
    // Remove the raw fields we don't need in response
    delete restaurantData.color_theme_name;
    delete restaurantData.color_theme_data;
    
    return {success: true, data: restaurantData};
};

const getItemsData = async (ownerId) => {
    const query = `
        WITH item_tags AS (
            SELECT it.item_id, array_agg(json_build_object('id', t.id, 'name', t.name, 'color', t.color)) as tags
            FROM item_tag it
            JOIN tags t ON it.tag_id = t.id
            GROUP BY it.item_id
        ),
        main_images AS (
            SELECT i.item_id, i.image_url as main_image
            FROM images i
            WHERE i.ismain = true
        ),
        other_images AS (
            SELECT 
                item_id,
                json_agg(json_build_object('id', id, 'url', image_url)) as images
            FROM images
            WHERE ismain = false
            GROUP BY item_id
        )
        SELECT 
            c.id as category_id,
            c.name as category_name,
            json_agg(
                json_build_object(
                    'id', i.id,
                    'name', i.name,
                    'description', i.description,
                    'price', i.price,
                    'main_image', mi.main_image,
                    'other_images', COALESCE(oi.images, '[]'::json),
                    'tags', COALESCE(it.tags, array[]::json[])
                )
                ORDER BY i.id
            ) as items
        FROM categories c
        JOIN items i ON c.id = i.category_id
        LEFT JOIN item_tags it ON i.id = it.item_id
        LEFT JOIN main_images mi ON i.id = mi.item_id
        LEFT JOIN other_images oi ON i.id = oi.item_id
        WHERE c.owner_id = $1
        GROUP BY c.id, c.name
        ORDER BY c.id;
    `;
    const result = await db.query(query, [ownerId]);

    if (result.rows.length === 0) {
        return {success: false, code: 404, message: 'Restaurant not found or no items available'}
    }

    return {success: true, data: result.rows} || null;
};


module.exports = {
    getRestaurantData,
    getItemsData
};