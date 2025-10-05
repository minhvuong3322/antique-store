const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const paymentController = require('../controllers/paymentController');
const { authenticate, isAdmin } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');

// Validation rules
const processPaymentValidation = [
    body('order_id').isInt().withMessage('ID đơn hàng không hợp lệ'),
    body('payment_method').isIn(['COD', 'VNPay', 'Momo', 'PayPal', 'BankTransfer'])
        .withMessage('Phương thức thanh toán không hợp lệ'),
    validate
];

// Public routes (for payment gateway callbacks)
router.get('/callback', paymentController.paymentCallback);

// Protected routes
router.use(authenticate);
router.get('/order/:orderId', paymentController.getPaymentByOrderId);
router.post('/process', processPaymentValidation, paymentController.processPayment);
router.post('/vnpay/create', paymentController.createVNPayPayment);
router.post('/momo/create', paymentController.createMomoPayment);

// Admin routes
router.get('/admin/stats', isAdmin, paymentController.getPaymentStats);

module.exports = router;



