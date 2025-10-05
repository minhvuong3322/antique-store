const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const categoryController = require('../controllers/categoryController');
const { authenticate, isAdmin } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');

// Validation rules
const categoryValidation = [
    body('name').notEmpty().withMessage('Tên danh mục không được để trống'),
    validate
];

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:identifier', categoryController.getCategoryById);

// Protected routes (Admin only)
router.post('/', authenticate, isAdmin, categoryValidation, categoryController.createCategory);
router.put('/:id', authenticate, isAdmin, categoryController.updateCategory);
router.delete('/:id', authenticate, isAdmin, categoryController.deleteCategory);

module.exports = router;



