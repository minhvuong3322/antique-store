const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const orderController = require('../controllers/orderController');
const { authenticate, isAdmin, authorize } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');

// Validation rules
const createOrderValidation = [
    body('shipping_address').notEmpty().withMessage('Địa chỉ giao hàng không được để trống'),
    validate
];

const updateStatusValidation = [
    body('status').isIn(['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'])
        .withMessage('Trạng thái không hợp lệ'),
    validate
];

// Customer routes
router.use(authenticate);
router.post('/', createOrderValidation, orderController.createOrder);
router.get('/', orderController.getUserOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id/cancel', orderController.cancelOrder);

// Admin routes (Admin and Staff can access)
router.get('/admin/all', authorize('admin', 'staff'), orderController.getAllOrders);
router.put('/:id/status', authorize('admin', 'staff'), updateStatusValidation, orderController.updateOrderStatus);

module.exports = router;



