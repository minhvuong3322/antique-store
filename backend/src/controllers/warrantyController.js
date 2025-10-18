const { Warranty, Order, Product, User } = require('../models');
const logger = require('../utils/logger');
const { Op } = require('sequelize');

/**
 * @desc    Get all warranties (Admin only)
 * @route   GET /api/warranties
 * @access  Private/Admin
 */
exports.getAllWarranties = async (req, res, next) => {
    try {
        const { status, search, page = 1, limit = 10 } = req.query;

        const offset = (page - 1) * limit;
        const where = {};

        if (status) {
            where.status = status;
        }

        if (search) {
            where.warranty_code = { [Op.like]: `%${search}%` };
        }

        const { count, rows: warranties } = await Warranty.findAndCountAll({
            where,
            include: [
                {
                    association: 'order',
                    include: [{ association: 'user', attributes: ['id', 'email', 'full_name', 'phone'] }]
                },
                {
                    association: 'product',
                    attributes: ['id', 'name', 'sku', 'images']
                }
            ],
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            success: true,
            count,
            total_pages: Math.ceil(count / limit),
            current_page: parseInt(page),
            data: warranties
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'getAllWarranties',
            user: req.user?.id
        });
        next(error);
    }
};

/**
 * @desc    Get warranty by ID
 * @route   GET /api/warranties/:id
 * @access  Private
 */
exports.getWarrantyById = async (req, res, next) => {
    try {
        const warranty = await Warranty.findByPk(req.params.id, {
            include: [
                {
                    association: 'order',
                    include: [{ association: 'user', attributes: ['id', 'email', 'full_name', 'phone'] }]
                },
                {
                    association: 'product',
                    attributes: ['id', 'name', 'sku', 'images', 'description']
                }
            ]
        });

        if (!warranty) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy thông tin bảo hành'
            });
        }

        // Check permission: Admin or warranty owner
        if (req.user.role !== 'admin' && warranty.order.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền xem thông tin bảo hành này'
            });
        }

        res.status(200).json({
            success: true,
            data: warranty
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'getWarrantyById',
            warranty_id: req.params.id,
            user: req.user?.id
        });
        next(error);
    }
};

/**
 * @desc    Get warranty by code (public search)
 * @route   GET /api/warranties/code/:code
 * @access  Public
 */
exports.getWarrantyByCode = async (req, res, next) => {
    try {
        const warranty = await Warranty.findByCode(req.params.code);

        if (!warranty) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy mã bảo hành'
            });
        }

        res.status(200).json({
            success: true,
            data: warranty
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'getWarrantyByCode',
            warranty_code: req.params.code
        });
        next(error);
    }
};

/**
 * @desc    Get user's warranties
 * @route   GET /api/warranties/my-warranties
 * @access  Private
 */
exports.getMyWarranties = async (req, res, next) => {
    try {
        const warranties = await Warranty.findByUser(req.user.id);

        res.status(200).json({
            success: true,
            count: warranties.length,
            data: warranties
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'getMyWarranties',
            user: req.user?.id
        });
        next(error);
    }
};

/**
 * @desc    Create warranty (Auto or manual by admin)
 * @route   POST /api/warranties
 * @access  Private/Admin
 */
exports.createWarranty = async (req, res, next) => {
    try {
        const { order_id, product_id, warranty_period = 12 } = req.body;

        // Validate order and product exist
        const order = await Order.findByPk(order_id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        const product = await Product.findByPk(product_id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy sản phẩm'
            });
        }

        // Generate warranty code
        const warranty_code = Warranty.generateWarrantyCode(order.order_number, product_id);

        // Calculate dates
        const warranty_date = new Date();
        const expiry_date = new Date();
        expiry_date.setMonth(expiry_date.getMonth() + warranty_period);

        const warranty = await Warranty.create({
            order_id,
            product_id,
            warranty_code,
            warranty_date,
            expiry_date,
            warranty_period,
            status: 'active'
        });

        logger.info(`Warranty created: ${warranty_code} by user ${req.user.id}`);

        res.status(201).json({
            success: true,
            message: 'Tạo bảo hành thành công',
            data: warranty
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'createWarranty',
            user: req.user?.id,
            body: req.body
        });
        next(error);
    }
};

/**
 * @desc    Claim warranty (Customer request)
 * @route   PUT /api/warranties/:id/claim
 * @access  Private
 */
exports.claimWarranty = async (req, res, next) => {
    try {
        const { issue_description } = req.body;

        const warranty = await Warranty.findByPk(req.params.id, {
            include: [{ association: 'order' }]
        });

        if (!warranty) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy thông tin bảo hành'
            });
        }

        // Check ownership
        if (warranty.order.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền yêu cầu bảo hành này'
            });
        }

        // Check if can claim
        if (!warranty.canClaim()) {
            return res.status(400).json({
                success: false,
                message: warranty.isExpired()
                    ? 'Bảo hành đã hết hạn'
                    : 'Bảo hành không thể yêu cầu (đã sử dụng hoặc đã hủy)'
            });
        }

        warranty.status = 'claimed';
        warranty.issue_description = issue_description;
        warranty.claimed_at = new Date();
        await warranty.save();

        logger.info(`Warranty claimed: ${warranty.warranty_code} by user ${req.user.id}`);

        // TODO: Send notification to admin

        res.status(200).json({
            success: true,
            message: 'Yêu cầu bảo hành thành công. Chúng tôi sẽ liên hệ với bạn sớm.',
            data: warranty
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'claimWarranty',
            warranty_id: req.params.id,
            user: req.user?.id
        });
        next(error);
    }
};

/**
 * @desc    Update warranty status (Admin only)
 * @route   PUT /api/warranties/:id
 * @access  Private/Admin
 */
exports.updateWarranty = async (req, res, next) => {
    try {
        const { status, admin_notes } = req.body;

        const warranty = await Warranty.findByPk(req.params.id);

        if (!warranty) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy thông tin bảo hành'
            });
        }

        if (status) {
            warranty.status = status;

            // Update completed_at if status is completed
            if (status === 'completed' && !warranty.completed_at) {
                warranty.completed_at = new Date();
            }
        }

        if (admin_notes) {
            warranty.admin_notes = admin_notes;
        }

        await warranty.save();

        logger.info(`Warranty updated: ${warranty.warranty_code} by admin ${req.user.id}`);

        res.status(200).json({
            success: true,
            message: 'Cập nhật bảo hành thành công',
            data: warranty
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'updateWarranty',
            warranty_id: req.params.id,
            user: req.user?.id
        });
        next(error);
    }
};

/**
 * @desc    Delete warranty (Admin only)
 * @route   DELETE /api/warranties/:id
 * @access  Private/Admin
 */
exports.deleteWarranty = async (req, res, next) => {
    try {
        const warranty = await Warranty.findByPk(req.params.id);

        if (!warranty) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy thông tin bảo hành'
            });
        }

        await warranty.destroy();

        logger.info(`Warranty deleted: ${warranty.warranty_code} by admin ${req.user.id}`);

        res.status(200).json({
            success: true,
            message: 'Xóa bảo hành thành công'
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'deleteWarranty',
            warranty_id: req.params.id,
            user: req.user?.id
        });
        next(error);
    }
};

/**
 * @desc    Update expired warranties (Cron job)
 * @route   PUT /api/warranties/update-expired
 * @access  Private/Admin
 */
exports.updateExpiredWarranties = async (req, res, next) => {
    try {
        const expiredWarranties = await Warranty.findExpired();

        let updatedCount = 0;
        for (const warranty of expiredWarranties) {
            warranty.status = 'expired';
            await warranty.save();
            updatedCount++;
        }

        logger.info(`Updated ${updatedCount} expired warranties`);

        res.status(200).json({
            success: true,
            message: `Đã cập nhật ${updatedCount} bảo hành hết hạn`,
            count: updatedCount
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'updateExpiredWarranties',
            user: req.user?.id
        });
        next(error);
    }
};

