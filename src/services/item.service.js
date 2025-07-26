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
  mainImageOriginalName,
  tags
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
        const isMain = images[i].originalname === mainImageOriginalName;
        await db.query(
          "INSERT INTO images (item_id, image_url, ismain) VALUES ($1, $2, $3)",
          [item.id, images[i].filename.replace(/\\/g, "/"), isMain]
        );
      }
    }

    await updateItemTags(item.id, tags);

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

 function moveFileWithDirCreation(sourcePath, destinationPath) {
    // Extract the directory part of the destination path
    const destinationDir = path.dirname(destinationPath);
    const sourceDir = path.dirname(sourcePath);
    
    // Create directories recursively if they don't exist
    if (!fs.existsSync(destinationDir)) {
      fs.mkdirSync(destinationDir, { recursive: true });
    }
    
    // Move the file
    fs.renameSync(sourcePath, destinationPath);
    deleteEmptyParents(sourceDir);

  
}


// Add helper function for tag management
const updateItemTags = async (itemId, tags) => {

  tags = tags.split(",").map(tag => tag.trim()).filter(tag => tag !== "");

 await db.query('DELETE FROM item_tag WHERE item_id = $1', [itemId]);
  
  if (tags && tags.length) {
    const insertValues = tags.map(tagId => `(${itemId}, ${tagId})`).join(',');
    console.log("Inserting item tags:", insertValues);

    await db.query(`
      INSERT INTO item_tag (item_id, tag_id)
      VALUES ${insertValues}
    `);
  }
};


const updateItem = async ({
  itemId,
  name,
  description,
  price,
  category_id,
  ownerId,
  tags

}) => {
  try {
    // Verify item belongs to owner
    const itemCheck = await db.query(
      `SELECT i.id, c.id as category_id_old FROM items i 
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

    if(itemCheck.rows[0].category_id_old != category_id){

    // Validate new category belongs to owner
    const categoryCheck = await db.query(
        "SELECT 1 FROM categories WHERE id = $1 AND owner_id = $2",
        [category_id, ownerId]
      );
  
      if (!categoryCheck.rows.length) {
        
        return { success: false, code: 400, message: "Invalid category" };
      }

      /////
         // Get images to move
    const images = await db.query(
      "SELECT image_url FROM images WHERE item_id = $1",
      [itemId]
    );

   // move images to new category
     images.rows.forEach( (image) => {
      try {
         moveFileWithDirCreation(`./images/${ownerId}/${itemCheck.rows[0].category_id_old}/${image.image_url}`, `./images/${ownerId}/${category_id}/${image.image_url}`);

      } catch (err) {
        console.error("Error moving image file:", err);
        throw err;
      }
    });
    }

    // Update item details
    await db.query(
      "UPDATE items SET name = $1, description = $2, price = $3, category_id = $4 WHERE id = $5",
      [name, description, price, category_id, itemId]
    );

    await updateItemTags(itemId, tags);


   

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



const updateItemImages = async ({
  itemId,
  ownerId,
  newImages,
  mainImageOriginalName
}) => {
  try {
        // Verify item belongs to owner
    const itemCheck = await db.query(
      `SELECT i.id, c.id as category_id FROM items i 
       JOIN categories c ON i.category_id = c.id 
       WHERE i.id = $1 AND c.owner_id = $2`,
      [itemId, ownerId]
    );

    if (!itemCheck.rows.length) {
      cleanup(newImages); // Cleanup any uploaded files on error
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
        const pathToDelete = `./images/${ownerId}/${itemCheck.rows[0].category_id}/${image.image_url}`;
        fs.unlinkSync(pathToDelete);
        deleteEmptyParents(path.dirname(pathToDelete));
      } catch (err) {
        console.error("\nError deleting image file:\n");
        throw err;

      }
    });

    // Delete from database
    await db.query("DELETE FROM images WHERE item_id = $1", [itemId]);



    //add images to db
        if (newImages && newImages.length) {
      for (let i = 0; i < newImages.length; i++) {
        const isMain = newImages[i].originalname === mainImageOriginalName;
        await db.query(
          "INSERT INTO images (item_id, image_url, ismain) VALUES ($1, $2, $3)",
          [itemId, newImages[i].filename.replace(/\\/g, "/"), isMain]
        );
      }
    }
    
    await db.query("COMMIT");

    return { success: true };
  } catch (error) {
    await db.query("ROLLBACK");
    cleanup(newImages); // Cleanup any uploaded files on error
    throw error;
  }
}

const deleteItem = async (itemId, ownerId) => {
  try {
    // Verify item belongs to owner
    const itemCheck = await db.query(
      `SELECT i.id, c.id as category_id FROM items i 
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
        const pathToDelete = `./images/${ownerId}/${itemCheck.rows[0].category_id}/${image.image_url}`;
        fs.unlinkSync(pathToDelete);
        deleteEmptyParents(path.dirname(pathToDelete));
      } catch (err) {
        console.error("Error deleting image file:", err);
        throw err;

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
  const itemResult = await db.query("SELECT * FROM items WHERE id = $1", [itemId]);
  const imagesResult = await db.query("SELECT * FROM images WHERE item_id = $1", [itemId]);
  const tagsResult = await db.query(`
    SELECT t.id, t.name, t.color 
    FROM item_tag it
    JOIN tags t ON it.tag_id = t.id
    WHERE it.item_id = $1
  `, [itemId]);

  return {
    ...itemResult.rows[0],
    images: imagesResult.rows,
    tags: tagsResult.rows
  };
};

module.exports = {
  createItem,
  updateItem,
  deleteItem,
  deleteImage,
  updateItemImages,
};
