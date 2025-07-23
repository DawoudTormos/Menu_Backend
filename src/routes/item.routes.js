const express = require("express");
const router = express.Router();
const itemController = require("../controllers/item.controller");
const { protect } = require("../middleware/auth.middleware");
const { upload, handleUploadErrors } = require("../utils/fileUpload"); 
const { getItemCategory, checkCategoryOwnership } = require("../middleware/items.middleware"); 
const multer = require('multer');


router.post("/", protect, upload.array("images", 5), handleUploadErrors,  itemController.createItem);
router.put("/details/:id", protect, checkCategoryOwnership, itemController.updateItem);
router.put("/images/:id", protect, getItemCategory,  upload.array("newImages", 5), handleUploadErrors, itemController.updateItemImages);
router.delete("/:id", protect, itemController.deleteItem);
router.delete("/images/:id", protect, itemController.deleteImage);

module.exports = router;
