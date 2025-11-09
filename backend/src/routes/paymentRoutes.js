const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const paymentController = require('../controllers/paymentController');
const { authenticate, isAdmin } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');

// Validation rules
const processPaymentValidation = [
    body('order_id').isInt().withMessage('ID đơn hàng không hợp lệ'),
    body('payment_method').isIn(['COD', 'VNPay', 'Momo', 'PayPal', 'BankTransfer', 'QRCode'])
        .withMessage('Phương thức thanh toán không hợp lệ'),
    validate
];

// Public routes (for payment gateway callbacks)
router.get('/callback', paymentController.paymentCallback);
router.post('/webhook', paymentController.paymentWebhook); // Webhook từ app thanh toán

// Protected routes
router.use(authenticate);
router.get('/order/:orderId', paymentController.getPaymentByOrderId);
router.get('/status/:identifier', paymentController.checkPaymentStatus); // Check payment status
router.post('/process', processPaymentValidation, paymentController.processPayment);
router.post('/vnpay/create', paymentController.createVNPayPayment);
router.post('/momo/create', paymentController.createMomoPayment);
router.post('/qrcode/create', paymentController.createQRCodePayment);

// Admin routes
router.get('/admin/stats', isAdmin, paymentController.getPaymentStats);

module.exports = router;



