const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const cartController = require('../controllers/cartController');
const { authenticate } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');

// Validation rules
const addToCartValidation = [
    body('product_id').isInt().withMessage('ID sản phẩm không hợp lệ'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Số lượng phải lớn hơn 0'),
    validate
];

const updateCartValidation = [
    body('quantity').isInt({ min: 1 }).withMessage('Số lượng phải lớn hơn 0'),
    validate
];

// All cart routes require authentication
router.use(authenticate);

router.get('/', cartController.getCart);
router.post('/', addToCartValidation, cartController.addToCart);
router.put('/:id', updateCartValidation, cartController.updateCartItem);
router.delete('/:id', cartController.removeFromCart);
router.delete('/', cartController.clearCart);

module.exports = router;



