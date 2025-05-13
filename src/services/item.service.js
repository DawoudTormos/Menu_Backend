const db = require("../config/db");
const fs = require("fs");
const path = require("path");

const createItem = async ({
  name,
  description,
  price,
  category_id,
  ownerId,
  images,
  mainImageIndex,
}) => {
  try {
    // Validate category belongs to owner
    const categoryCheck = await db.query(
      "SELECT 1 FROM categories WHERE id = $1 AND owner_id = $2",
      [category_id, ownerId]
    );

    if (!categoryCheck.rows.length) {
      cleanup(images);
      return { success: false, code: 400, message: "Invalid category" };
    }

    // Start transaction
    await db.query("BEGIN");

    // Create item
    const itemResult = await db.query(
      "INSERT INTO items (name, description, price, category_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, description, price, category_id]
    );
    const item = itemResult.rows[0];

    // Process images
    if (images && images.length) {
      for (let i = 0; i < images.length; i++) {
        const isMain = i === parseInt(mainImageIndex || 0);
        await db.query(
          "INSERT INTO images (item_id, image_url, ismain) VALUES ($1, $2, $3)",
          [item.id, images[i].path.replace(/\\/g, "/"), isMain]
        );
      }
    }

    await db.query("COMMIT");

    return {
      success: true,
      data: await getItemWithDetails(item.id),
    };
  } catch (error) {
    await db.query("ROLLBACK");

    cleanup(images); // Cleanup any uploaded files on error

    throw error;
  }
};

const cleanup = (images) => {
  // Cleanup any uploaded files
  if (images && images.length) {
    images.forEach((image) => {
      try {
        fs.unlinkSync(image.path);
        deleteEmptyParents(path.dirname(image.path));
      } catch (err) {
        console.error("Error cleaning up file:", err);
      }
    });
  }
};

function deleteEmptyParents(dir) {
  const parentDir = path.dirname(dir); // Get parent directory

  if (dir.endsWith("/images") || dir.endsWith("\\images")) {
    return; // Skip if not in the images directory
  }

  // Skip if we've reached the root (e.g., 'C:\' or '/')
  if (dir === parentDir) return;

  // Check if directory is empty
  const files = fs.readdirSync(dir);
  if (files.length === 0) {
    fs.rmdirSync(dir); // Delete empty directory
    deleteEmptyParents(parentDir); // Check parent recursively
  }
}

const updateItem = async ({
  itemId,
  name,
  description,
  price,
  category_id,
  ownerId,
  newImages,
  mainImageID,
  imagesToDelete,
}) => {
  try {
    // Verify item belongs to owner
    const itemCheck = await db.query(
      `SELECT i.id FROM items i 
       JOIN categories c ON i.category_id = c.id 
       WHERE i.id = $1 AND c.owner_id = $2`,
      [itemId, ownerId]
    );

    if (!itemCheck.rows.length) {
      return {
        success: false,
        code: 404,
        message: "Item not found or not owned by you",
      };
    }

    // Validate new category belongs to owner
    const categoryCheck = await db.query(
        "SELECT 1 FROM categories WHERE id = $1 AND owner_id = $2",
        [category_id, ownerId]
      );
  
      if (!categoryCheck.rows.length) {
        cleanup(images);
        return { success: false, code: 400, message: "Invalid category" };
      }

      

    await db.query("BEGIN");

    // Update item details
    await db.query(
      "UPDATE items SET name = $1, description = $2, price = $3, category_id = $4 WHERE id = $5",
      [name, description, price, category_id, itemId]
    );

    // Delete specified images
    if (imagesToDelete && imagesToDelete.length) {
      for (const imageId of imagesToDelete) {
        const image = await db.query(
          "SELECT * FROM images WHERE id = $1 AND item_id = $2",
          [imageId, itemId]
        );
        if (image.rows.length) {
          fs.unlinkSync(image.rows[0].image_url);
          deleteEmptyParents(path.dirname(image.image_url))
          await db.query("DELETE FROM images WHERE id = $1", [imageId]);
        }
      }
    }


    // Add new images
    if (newImages && newImages.length) {
      for (let i = 0; i < newImages.length; i++) {
        const isMain = i === parseInt(mainImageIndex || 0);
        await db.query(
          "INSERT INTO images (item_id, image_url, ismain) VALUES ($1, $2, $3)",
          [itemId, newImages[i].path.replace(/\\/g, "/"), isMain]
        );
      }
    }



    // Update main image if not specified
    if (mainImageID !== undefined && mainImageID !== null && Number.isInteger(mainImageID)) {
      await db.query(`
            UPDATE images 
            SET ismain = CASE WHEN id = $2 THEN true ELSE false END
            WHERE item_id = $1;`,
            [itemId, mainImageID]);
    }else{
      await db.query(`WITH oldest_image AS (
          SELECT id 
          FROM images 
          WHERE item_id = $1 
          ORDER BY created_at ASC 
          LIMIT 1
        )
        UPDATE images 
        SET ismain = CASE WHEN id = (SELECT id FROM oldest_image) THEN true ELSE false END
        WHERE item_id = $1;`,
        [itemId]);

    }

    await db.query("COMMIT");

    return {
      success: true,
      data: await getItemWithDetails(itemId),
    };
  } catch (error) {
    await db.query("ROLLBACK");
    throw error;
  }
};

const deleteItem = async (itemId, ownerId) => {
  try {
    // Verify item belongs to owner
    const itemCheck = await db.query(
      `SELECT i.id FROM items i 
       JOIN categories c ON i.category_id = c.id 
       WHERE i.id = $1 AND c.owner_id = $2`,
      [itemId, ownerId]
    );

    if (!itemCheck.rows.length) {
      return {
        success: false,
        code: 404,
        message: "Item not found or not owned by you",
      };
    }

    await db.query("BEGIN");

    // Get images to delete
    const images = await db.query(
      "SELECT image_url FROM images WHERE item_id = $1",
      [itemId]
    );

    // Delete images from filesystem
    images.rows.forEach((image) => {
      try {
        fs.unlinkSync(image.image_url);
        deleteEmptyParents(path.dirname(image.image_url));
      } catch (err) {
        console.error("Error deleting image file:", err);
      }
    });

    // Delete from database
    await db.query("DELETE FROM items WHERE id = $1", [itemId]);

    await db.query("COMMIT");

    return { success: true };
  } catch (error) {
    await db.query("ROLLBACK");
    throw error;
  }
};

const deleteImage = async (imageId, ownerId) => {
  try {
    const imageCheck = await db.query(
      `SELECT i.* FROM images i
       JOIN items it ON i.item_id = it.id
       JOIN categories c ON it.category_id = c.id
       WHERE i.id = $1 AND c.owner_id = $2`,
      [imageId, ownerId]
    );

    if (!imageCheck.rows.length) {
      return {
        success: false,
        code: 404,
        message: "Image not found or not owned by you",
      };
    }

    await db.query("BEGIN");

    // Delete from filesystem
    fs.unlinkSync(imageCheck.rows[0].image_url);

    // Delete from database
    await db.query("DELETE FROM images WHERE id = $1", [imageId]);

    await db.query("COMMIT");

    return { success: true };
  } catch (error) {
    await db.query("ROLLBACK");
    throw error;
  }
};

const getItemWithDetails = async (itemId) => {
  const itemResult = await db.query("SELECT * FROM items WHERE id = $1", [
    itemId,
  ]);
  const imagesResult = await db.query(
    "SELECT * FROM images WHERE item_id = $1",
    [itemId]
  );

  return {
    ...itemResult.rows[0],
    images: imagesResult.rows,
  };
};

module.exports = {
  createItem,
  updateItem,
  deleteItem,
  deleteImage,
};
