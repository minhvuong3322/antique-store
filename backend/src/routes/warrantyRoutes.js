const express = require('express');
const router = express.Router();
const warrantyController = require('../controllers/warrantyController');
const { protect, authorize } = require('../middlewares/auth');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validate');

// Validation rules
const createWarrantyValidation = [
    body('order_id').isInt().withMessage('order_id phải là số nguyên'),
    body('product_id').isInt().withMessage('product_id phải là số nguyên'),
    body('warranty_period').optional().isInt({ min: 1 }).withMessage('warranty_period phải >= 1'),
    validate
];

const claimWarrantyValidation = [
    body('issue_description').notEmpty().withMessage('Vui lòng mô tả vấn đề'),
    validate
];

const updateWarrantyValidation = [
    body('status').optional().isIn(['active', 'claimed', 'processing', 'completed', 'expired', 'cancelled'])
        .withMessage('Trạng thái không hợp lệ'),
    validate
];

// Public routes
router.get('/code/:code', warrantyController.getWarrantyByCode);

// Protected routes
router.use(protect);

// Customer routes
router.get('/my-warranties', warrantyController.getMyWarranties);
router.put('/:id/claim', claimWarrantyValidation, warrantyController.claimWarranty);

// Admin routes
router.get('/', authorize('admin'), warrantyController.getAllWarranties);
router.get('/:id', warrantyController.getWarrantyById);
router.post('/', authorize('admin'), createWarrantyValidation, warrantyController.createWarranty);
router.put('/:id', authorize('admin'), updateWarrantyValidation, warrantyController.updateWarranty);
router.delete('/:id', authorize('admin'), warrantyController.deleteWarranty);
router.put('/update-expired', authorize('admin'), warrantyController.updateExpiredWarranties);

module.exports = router;

