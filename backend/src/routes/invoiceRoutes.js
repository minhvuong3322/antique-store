const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { protect, authorize } = require('../middlewares/auth');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validate');

// Validation rules
const createInvoiceValidation = [
    body('order_id').isInt().withMessage('order_id phải là số nguyên'),
    body('customer_tax_code').optional().isString(),
    body('notes').optional().isString(),
    validate
];

const updateInvoiceValidation = [
    body('payment_status').optional().isIn(['unpaid', 'paid', 'partially_paid', 'refunded'])
        .withMessage('payment_status không hợp lệ'),
    validate
];

// All routes require authentication
router.use(protect);

// Customer routes
router.get('/my-invoices', invoiceController.getMyInvoices);
router.get('/order/:orderId', invoiceController.getInvoiceByOrderId);
router.get('/:id', invoiceController.getInvoiceById);

// Admin routes
router.get('/', authorize('admin'), invoiceController.getAllInvoices);
router.post('/', authorize('admin'), createInvoiceValidation, invoiceController.createInvoice);
router.put('/:id', authorize('admin'), updateInvoiceValidation, invoiceController.updateInvoice);
router.delete('/:id', authorize('admin'), invoiceController.deleteInvoice);
router.post('/:id/send-email', authorize('admin'), invoiceController.sendInvoiceEmail);
router.get('/pending', authorize('admin'), invoiceController.getPendingInvoices);
router.get('/statistics', authorize('admin'), invoiceController.getInvoiceStatistics);

module.exports = router;

