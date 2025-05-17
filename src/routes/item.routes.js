const express = require("express");
const router = express.Router();
const itemController = require("../controllers/item.controller");
const { protect } = require("../middleware/auth.middleware");
const {upload} = require("../utils/fileUpload");

router.post("/", protect, upload.array("images", 5),  itemController.createItem);
router.put("/details/:id", protect, itemController.updateItem);
router.put("/images/:id", protect, upload.array("newImages", 5), itemController.updateItemImages);
router.delete("/:id", protect, itemController.deleteItem);
router.delete("/images/:id", protect, itemController.deleteImage);

module.exports = router;
