const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const { protect, authorize } = require('../middlewares/auth');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validate');

// Validation rules
const createSupplierValidation = [
    body('company_name').notEmpty().withMessage('Tên công ty không được để trống'),
    body('contact_person').notEmpty().withMessage('Người liên hệ không được để trống'),
    body('email').isEmail().withMessage('Email không hợp lệ'),
    body('phone').notEmpty().withMessage('Số điện thoại không được để trống'),
    validate
];

const updateSupplierValidation = [
    body('email').optional().isEmail().withMessage('Email không hợp lệ'),
    validate
];

const addProductValidation = [
    body('product_id').isInt().withMessage('product_id phải là số nguyên'),
    body('supply_price').isFloat({ min: 0 }).withMessage('supply_price phải >= 0'),
    body('is_primary').optional().isBoolean().withMessage('is_primary phải là boolean'),
    validate
];

// All routes require authentication
router.use(protect);

// Routes accessible by admin and supplier owner
router.get('/:id', supplierController.getSupplierById);
router.put('/:id', updateSupplierValidation, supplierController.updateSupplier);
router.get('/:id/products', supplierController.getSupplierProducts);

// Admin only routes
router.get('/', authorize('admin'), supplierController.getAllSuppliers);
router.post('/', authorize('admin'), createSupplierValidation, supplierController.createSupplier);
router.delete('/:id', authorize('admin'), supplierController.deleteSupplier);
router.post('/:id/products', authorize('admin'), addProductValidation, supplierController.addProductToSupplier);
router.delete('/:id/products/:productId', authorize('admin'), supplierController.removeProductFromSupplier);

module.exports = router;

