const { User, Product, Order, OrderDetail, Payment, Category, Supplier, Invoice, WarehouseLog, sequelize } = require('../models');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

/**
 * @desc    Get dashboard overview statistics
 * @route   GET /api/admin/dashboard/overview
 * @access  Private/Admin
 */
exports.getDashboardOverview = async (req, res, next) => {
    try {
        // Total counts
        const totalUsers = await User.count({ where: { role: 'customer' } });
        const totalProducts = await Product.count({ where: { is_active: true } });
        const totalOrders = await Order.count();
        const totalRevenue = await Payment.sum('amount', {
            where: { payment_status: 'completed' }
        }) || 0;

        // This month statistics
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const thisMonthOrders = await Order.count({
            where: {
                created_at: { [Op.gte]: startOfMonth }
            }
        });

        const thisMonthRevenue = await Payment.sum('amount', {
            where: {
                payment_status: 'completed',
                created_at: { [Op.gte]: startOfMonth }
            }
        }) || 0;

        // Pending orders
        const pendingOrders = await Order.count({
            where: { status: 'pending' }
        });

        // Low stock products
        const lowStockProducts = await Product.count({
            where: {
                stock_quantity: { [Op.lte]: 10 },
                is_active: true
            }
        });

        res.status(200).json({
            success: true,
            data: {
                total_users: totalUsers,
                total_products: totalProducts,
                total_orders: totalOrders,
                total_revenue: parseFloat(totalRevenue).toFixed(2),
                this_month_orders: thisMonthOrders,
                this_month_revenue: parseFloat(thisMonthRevenue).toFixed(2),
                pending_orders: pendingOrders,
                low_stock_products: lowStockProducts
            }
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'getDashboardOverview',
            user: req.user?.id
        });
        next(error);
    }
};

/**
 * @desc    Get revenue statistics
 * @route   GET /api/admin/dashboard/revenue
 * @access  Private/Admin
 */
exports.getRevenueStatistics = async (req, res, next) => {
    try {
        const { period = 'month' } = req.query; // day, week, month, year

        let groupBy;
        let dateFormat;

        switch (period) {
            case 'day':
                groupBy = sequelize.fn('DATE', sequelize.col('created_at'));
                dateFormat = '%Y-%m-%d';
                break;
            case 'week':
                groupBy = sequelize.fn('YEARWEEK', sequelize.col('created_at'));
                dateFormat = '%Y-W%U';
                break;
            case 'year':
                groupBy = sequelize.fn('YEAR', sequelize.col('created_at'));
                dateFormat = '%Y';
                break;
            case 'month':
            default:
                groupBy = sequelize.fn('DATE_FORMAT', sequelize.col('created_at'), '%Y-%m');
                dateFormat = '%Y-%m';
                break;
        }

        const revenueData = await Payment.findAll({
            attributes: [
                [groupBy, 'period'],
                [sequelize.fn('SUM', sequelize.col('amount')), 'total_revenue'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'order_count']
            ],
            where: {
                payment_status: 'completed'
            },
            group: [groupBy],
            order: [[groupBy, 'ASC']],
            raw: true
        });

        res.status(200).json({
            success: true,
            period,
            data: revenueData
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'getRevenueStatistics',
            user: req.user?.id
        });
        next(error);
    }
};

/**
 * @desc    Get top selling products
 * @route   GET /api/admin/dashboard/top-products
 * @access  Private/Admin
 */
exports.getTopProducts = async (req, res, next) => {
    try {
        const { limit = 10 } = req.query;

        const topProducts = await OrderDetail.findAll({
            attributes: [
                'product_id',
                [sequelize.fn('SUM', sequelize.col('quantity')), 'total_sold'],
                [sequelize.fn('SUM', sequelize.col('subtotal')), 'total_revenue']
            ],
            include: [
                {
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name', 'sku', 'price', 'images']
                }
            ],
            group: ['product_id'],
            order: [[sequelize.fn('SUM', sequelize.col('quantity')), 'DESC']],
            limit: parseInt(limit),
            raw: false
        });

        res.status(200).json({
            success: true,
            count: topProducts.length,
            data: topProducts
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'getTopProducts',
            user: req.user?.id
        });
        next(error);
    }
};

/**
 * @desc    Get order statistics by status
 * @route   GET /api/admin/dashboard/orders-by-status
 * @access  Private/Admin
 */
exports.getOrdersByStatus = async (req, res, next) => {
    try {
        const orderStats = await Order.findAll({
            attributes: [
                'status',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['status'],
            raw: true
        });

        res.status(200).json({
            success: true,
            data: orderStats
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'getOrdersByStatus',
            user: req.user?.id
        });
        next(error);
    }
};

/**
 * @desc    Get recent activities
 * @route   GET /api/admin/dashboard/recent-activities
 * @access  Private/Admin
 */
exports.getRecentActivities = async (req, res, next) => {
    try {
        const { limit = 20 } = req.query;

        // Recent orders
        const recentOrders = await Order.findAll({
            limit: parseInt(limit) / 2,
            order: [['created_at', 'DESC']],
            include: [
                {
                    association: 'user',
                    attributes: ['id', 'email', 'full_name']
                }
            ]
        });

        // Recent users
        const recentUsers = await User.findAll({
            where: { role: 'customer' },
            limit: parseInt(limit) / 2,
            order: [['created_at', 'DESC']],
            attributes: ['id', 'email', 'full_name', 'created_at']
        });

        res.status(200).json({
            success: true,
            data: {
                recent_orders: recentOrders,
                recent_users: recentUsers
            }
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'getRecentActivities',
            user: req.user?.id
        });
        next(error);
    }
};

/**
 * @desc    Get user management data
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
exports.getAllUsers = async (req, res, next) => {
    try {
        const { role, is_active, search, page = 1, limit = 10 } = req.query;

        const offset = (page - 1) * limit;
        const where = {};

        if (role) where.role = role;
        // if (is_active !== undefined) where.is_active = is_active === 'true';

        if (search) {
            where[Op.or] = [
                { email: { [Op.like]: `%${search}%` } },
                { full_name: { [Op.like]: `%${search}%` } },
                { phone: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows: users } = await User.findAndCountAll({
            where,
            attributes: { exclude: ['password'] },
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            success: true,
            count,
            total_pages: Math.ceil(count / limit),
            current_page: parseInt(page),
            data: users
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'getAllUsers',
            user: req.user?.id
        });
        next(error);
    }
};

/**
 * @desc    Update user (Admin)
 * @route   PUT /api/admin/users/:id
 * @access  Private/Admin
 */
exports.updateUser = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }

        const { full_name, phone, address, role, is_active } = req.body;

        if (full_name) user.full_name = full_name;
        if (phone !== undefined) user.phone = phone;
        if (address !== undefined) user.address = address;
        if (role) user.role = role;
        if (is_active !== undefined) user.is_active = is_active;

        await user.save();

        logger.info(`User ${user.id} updated by admin ${req.user.id}`);

        res.status(200).json({
            success: true,
            message: 'Cập nhật người dùng thành công',
            data: user
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'updateUser',
            user_id: req.params.id,
            admin: req.user?.id
        });
        next(error);
    }
};

/**
 * @desc    Delete user (Admin)
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }

        // Prevent deleting admin
        if (user.role === 'admin') {
            return res.status(400).json({
                success: false,
                message: 'Không thể xóa tài khoản admin'
            });
        }

        // Prevent deleting self
        if (user.id === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'Không thể xóa chính mình'
            });
        }

        await user.destroy();

        logger.info(`User ${user.id} deleted by admin ${req.user.id}`);

        res.status(200).json({
            success: true,
            message: 'Xóa người dùng thành công'
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'deleteUser',
            user_id: req.params.id,
            admin: req.user?.id
        });
        next(error);
    }
};

/**
 * @desc    Get category statistics
 * @route   GET /api/admin/dashboard/categories-stats
 * @access  Private/Admin
 */
exports.getCategoryStatistics = async (req, res, next) => {
    try {
        const categoryStats = await Product.findAll({
            attributes: [
                'category_id',
                [sequelize.fn('COUNT', sequelize.col('Product.id')), 'product_count']
            ],
            include: [
                {
                    model: Category,
                    as: 'category',
                    attributes: ['id', 'name', 'slug']
                }
            ],
            group: ['category_id'],
            order: [[sequelize.fn('COUNT', sequelize.col('Product.id')), 'DESC']],
            raw: false
        });

        res.status(200).json({
            success: true,
            data: categoryStats
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'getCategoryStatistics',
            user: req.user?.id
        });
        next(error);
    }
};

/**
 * @desc    Get comprehensive analytics
 * @route   GET /api/admin/dashboard/analytics
 * @access  Private/Admin
 */
exports.getComprehensiveAnalytics = async (req, res, next) => {
    try {
        // Overview
        const totalUsers = await User.count({ where: { role: 'customer' } });
        const totalProducts = await Product.count({ where: { is_active: true } });
        const totalOrders = await Order.count();
        const totalSuppliers = await Supplier.count({ where: { is_active: true } });

        // Revenue
        const totalRevenue = await Payment.sum('amount', {
            where: { payment_status: 'completed' }
        }) || 0;

        // Orders by status
        const ordersByStatus = await Order.findAll({
            attributes: [
                'status',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['status'],
            raw: true
        });

        // Invoice statistics
        const totalInvoices = await Invoice.count();
        const paidInvoices = await Invoice.count({ where: { payment_status: 'paid' } });

        // Warehouse statistics
        const lowStockCount = await Product.count({
            where: {
                stock_quantity: { [Op.lte]: 10 },
                is_active: true
            }
        });

        const outOfStockCount = await Product.count({
            where: {
                stock_quantity: 0,
                is_active: true
            }
        });

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    total_users: totalUsers,
                    total_products: totalProducts,
                    total_orders: totalOrders,
                    total_suppliers: totalSuppliers,
                    total_revenue: parseFloat(totalRevenue).toFixed(2)
                },
                orders: {
                    by_status: ordersByStatus
                },
                invoices: {
                    total: totalInvoices,
                    paid: paidInvoices,
                    unpaid: totalInvoices - paidInvoices
                },
                warehouse: {
                    low_stock_count: lowStockCount,
                    out_of_stock_count: outOfStockCount
                }
            }
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'getComprehensiveAnalytics',
            user: req.user?.id
        });
        next(error);
    }
};

