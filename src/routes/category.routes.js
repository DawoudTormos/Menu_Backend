const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, categoryController.createCategory);
router.delete('/:id', protect, categoryController.deleteCategory);

module.exports = router;