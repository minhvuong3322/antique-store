const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const productController = require('../controllers/productController');
const { authenticate, isAdmin } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');

// Validation rules
const productValidation = [
    body('category_id').isInt().withMessage('ID danh mục không hợp lệ'),
    body('name').notEmpty().withMessage('Tên sản phẩm không được để trống'),
    body('price').isFloat({ min: 0 }).withMessage('Giá phải lớn hơn hoặc bằng 0'),
    validate
];

// Public routes
router.get('/featured', productController.getFeaturedProducts);
router.get('/', productController.getAllProducts);
router.get('/:identifier', productController.getProductById);

// Protected routes (Admin only)
router.post('/', authenticate, isAdmin, productValidation, productController.createProduct);
router.put('/:id', authenticate, isAdmin, productController.updateProduct);
router.delete('/:id', authenticate, isAdmin, productController.deleteProduct);

module.exports = router;



