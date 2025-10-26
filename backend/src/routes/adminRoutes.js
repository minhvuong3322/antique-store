const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const orderController = require('../controllers/orderController');
const { protect, authorize } = require('../middlewares/auth');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validate');

// Validation rules
const updateUserValidation = [
    body('role').optional().isIn(['admin', 'customer', 'supplier']).withMessage('role không hợp lệ'),
    body('is_active').optional().isBoolean().withMessage('is_active phải là boolean'),
    validate
];

// All routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Dashboard routes
router.get('/dashboard/overview', adminController.getDashboardOverview);
router.get('/dashboard/revenue', adminController.getRevenueStatistics);
router.get('/dashboard/top-products', adminController.getTopProducts);
router.get('/dashboard/orders-by-status', adminController.getOrdersByStatus);
router.get('/dashboard/recent-activities', adminController.getRecentActivities);
router.get('/dashboard/categories-stats', adminController.getCategoryStatistics);
router.get('/dashboard/analytics', adminController.getComprehensiveAnalytics);

// User management routes
router.get('/users', adminController.getAllUsers);
router.put('/users/:id', updateUserValidation, adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Order management routes
router.get('/orders/new-count', orderController.getNewOrdersCount);
router.get('/orders', orderController.getAllOrders);
router.put('/orders/:id/status', 
    body('status').isIn(['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'])
        .withMessage('Trạng thái không hợp lệ'),
    validate,
    orderController.updateOrderStatus
);

module.exports = router;

