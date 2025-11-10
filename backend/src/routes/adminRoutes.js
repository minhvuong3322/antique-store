const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const supportController = require('../controllers/supportController');
const { protect, authorize } = require('../middlewares/auth');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validate');

// Validation rules
const updateUserValidation = [
    body('role').optional().isIn(['admin', 'customer', 'staff']).withMessage('role không hợp lệ'),
    validate
];

// Base authentication
router.use(protect);

// Dashboard routes - admin only
router.get('/dashboard/overview', authorize('admin'), adminController.getDashboardOverview);
router.get('/dashboard/revenue', authorize('admin'), adminController.getRevenueStatistics);
router.get('/dashboard/top-products', authorize('admin'), adminController.getTopProducts);
router.get('/dashboard/orders-by-status', authorize('admin'), adminController.getOrdersByStatus);
router.get('/dashboard/recent-activities', authorize('admin'), adminController.getRecentActivities);
router.get('/dashboard/categories-stats', authorize('admin'), adminController.getCategoryStatistics);
router.get('/dashboard/analytics', authorize('admin'), adminController.getComprehensiveAnalytics);

// Product management routes - admin and staff
router.post('/products', authorize('admin', 'staff'), productController.createProduct);
router.put('/products/:id', authorize('admin', 'staff'), productController.updateProduct);
router.delete('/products/:id', authorize('admin', 'staff'), productController.deleteProduct);

// User management routes - admin and staff (staff can view, edit but with restrictions)
router.get('/users', authorize('admin', 'staff'), adminController.getAllUsers);
router.put('/users/:id', authorize('admin', 'staff'), updateUserValidation, adminController.updateUser);
router.delete('/users/:id', authorize('admin'), adminController.deleteUser); // Only admin can delete

// Order management routes - admin and staff
router.get('/orders/new-count', authorize('admin', 'staff'), orderController.getNewOrdersCount);
router.get('/orders', authorize('admin', 'staff'), orderController.getAllOrders);
router.put('/orders/:id/status', 
    authorize('admin', 'staff'),
    body('status').isIn(['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'])
        .withMessage('Trạng thái không hợp lệ'),
    validate,
    orderController.updateOrderStatus
);

// Support message management routes - admin and staff
router.get('/support', authorize('admin', 'staff'), supportController.getAllMessages);
router.put('/support/:id/respond', authorize('admin', 'staff'), supportController.respondToMessage);
router.put('/support/:id/status', authorize('admin', 'staff'), supportController.updateMessageStatus);

module.exports = router;

