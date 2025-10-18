const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouseController');
const { protect, authorize } = require('../middlewares/auth');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validate');

// Validation rules
const importValidation = [
    body('product_id').isInt().withMessage('product_id phải là số nguyên'),
    body('quantity').isInt({ min: 1 }).withMessage('quantity phải >= 1'),
    body('unit_price').optional().isFloat({ min: 0 }).withMessage('unit_price phải >= 0'),
    body('supplier_id').optional().isInt().withMessage('supplier_id phải là số nguyên'),
    validate
];

const exportValidation = [
    body('product_id').isInt().withMessage('product_id phải là số nguyên'),
    body('quantity').isInt({ min: 1 }).withMessage('quantity phải >= 1'),
    body('reference_type').optional().isIn(['order', 'purchase', 'manual']).withMessage('reference_type không hợp lệ'),
    validate
];

const adjustValidation = [
    body('product_id').isInt().withMessage('product_id phải là số nguyên'),
    body('new_quantity').isInt({ min: 0 }).withMessage('new_quantity phải >= 0'),
    body('notes').optional().isString(),
    validate
];

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Warehouse logs
router.get('/logs', warehouseController.getAllLogs);
router.get('/logs/:id', warehouseController.getLogById);

// Warehouse operations
router.post('/import', importValidation, warehouseController.importProducts);
router.post('/export', exportValidation, warehouseController.exportProducts);
router.post('/adjust', adjustValidation, warehouseController.adjustStock);

// Inventory management
router.get('/inventory/:productId', warehouseController.getProductInventory);
router.get('/low-stock', warehouseController.getLowStockProducts);

// Statistics
router.get('/statistics', warehouseController.getWarehouseStatistics);

module.exports = router;

