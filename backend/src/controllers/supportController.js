const { SupportMessage, User } = require('../models');
const { Op } = require('sequelize');

/**
 * Create support message (authenticated or guest)
 * POST /api/v1/support
 */
const createSupportMessage = async (req, res, next) => {
    try {
        const { subject, message, guest_name, guest_email, guest_phone } = req.body;
        const user_id = req.user?.id || null;

        // Validation
        if (!subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập đầy đủ thông tin'
            });
        }

        // If guest, require contact info
        if (!user_id && (!guest_name || !guest_email)) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập tên và email'
            });
        }

        const supportMessage = await SupportMessage.create({
            user_id,
            guest_name: user_id ? null : guest_name,
            guest_email: user_id ? null : guest_email,
            guest_phone: user_id ? null : guest_phone,
            subject,
            message,
            status: 'pending',
            priority: 'normal'
        });

        res.status(201).json({
            success: true,
            message: 'Tin nhắn của bạn đã được gửi. Chúng tôi sẽ phản hồi sớm nhất!',
            data: { supportMessage }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get user's support messages
 * GET /api/v1/support/my-messages
 */
const getMyMessages = async (req, res, next) => {
    try {
        const user_id = req.user.id;
        const { page = 1, limit = 20 } = req.query;

        const offset = (page - 1) * limit;

        const { count, rows: messages } = await SupportMessage.findAndCountAll({
            where: { user_id },
            include: [
                {
                    model: User,
                    as: 'responder',
                    attributes: ['id', 'full_name', 'email']
                }
            ],
            limit: parseInt(limit),
            offset,
            order: [['created_at', 'DESC']]
        });

        res.json({
            success: true,
            data: {
                messages,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total_pages: Math.ceil(count / limit)
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get support message by ID
 * GET /api/v1/support/:id
 */
const getMessageById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user_id = req.user?.id;
        const is_admin = req.user?.role === 'admin';

        const where = { id };
        if (!is_admin && user_id) {
            where.user_id = user_id;
        }

        const message = await SupportMessage.findOne({
            where,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'full_name', 'email', 'phone']
                },
                {
                    model: User,
                    as: 'responder',
                    attributes: ['id', 'full_name', 'email']
                }
            ]
        });

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy tin nhắn'
            });
        }

        res.json({
            success: true,
            data: { message }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all support messages (Admin only)
 * GET /api/v1/admin/support
 */
const getAllMessages = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, status, priority } = req.query;

        const where = {};
        if (status) where.status = status;
        if (priority) where.priority = priority;

        const offset = (page - 1) * limit;

        const { count, rows: messages } = await SupportMessage.findAndCountAll({
            where,
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'full_name', 'email', 'phone']
                },
                {
                    model: User,
                    as: 'responder',
                    attributes: ['id', 'full_name', 'email']
                }
            ],
            limit: parseInt(limit),
            offset,
            order: [
                ['priority', 'DESC'],
                ['created_at', 'DESC']
            ]
        });

        res.json({
            success: true,
            data: {
                messages,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total_pages: Math.ceil(count / limit)
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Respond to support message (Admin only)
 * PUT /api/v1/admin/support/:id/respond
 */
const respondToMessage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { admin_response, status } = req.body;
        const admin_id = req.user.id;

        const message = await SupportMessage.findByPk(id);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy tin nhắn'
            });
        }

        await message.update({
            admin_response,
            status: status || 'in_progress',
            responded_at: new Date(),
            responded_by: admin_id
        });

        res.json({
            success: true,
            message: 'Đã phản hồi tin nhắn hỗ trợ',
            data: { message }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update support message status (Admin only)
 * PUT /api/v1/admin/support/:id/status
 */
const updateMessageStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, priority } = req.body;

        const message = await SupportMessage.findByPk(id);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy tin nhắn'
            });
        }

        const updateData = {};
        if (status) updateData.status = status;
        if (priority) updateData.priority = priority;

        await message.update(updateData);

        res.json({
            success: true,
            message: 'Đã cập nhật trạng thái',
            data: { message }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createSupportMessage,
    getMyMessages,
    getMessageById,
    getAllMessages,
    respondToMessage,
    updateMessageStatus
};

