const { SupportMessage, User } = require('../models');
const { sequelize } = require('../config/database');
const { Op } = require('sequelize');

/**
 * Create support message (authenticated or guest)
 * POST /api/v1/support
 */
const createSupportMessage = async (req, res, next) => {
    try {
        const { subject, message, guest_name, guest_email, guest_phone, conversation_id, parent_id } = req.body;
        const user_id = req.user?.id || null;
        const user_role = req.user?.role;

        // Prevent admin/staff from creating support messages (they use admin routes)
        if (user_role === 'admin' || user_role === 'staff') {
            return res.status(403).json({
                success: false,
                message: 'Admin và nhân viên không thể tạo tin nhắn hỗ trợ. Vui lòng sử dụng trang quản trị.'
            });
        }

        // Validation
        if (!message) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập tin nhắn'
            });
        }

        // If creating new conversation, require subject
        if (!conversation_id && !subject) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập chủ đề'
            });
        }

        // If guest and new conversation, require contact info
        if (!conversation_id && !user_id && (!guest_name || !guest_email)) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng nhập tên và email'
            });
        }

        let conversationRootId = conversation_id;
        let finalSubject = subject;

        // If replying to conversation, get the root conversation
        if (conversation_id) {
            const parentMessage = await SupportMessage.findByPk(conversation_id);
            if (!parentMessage) {
                return res.status(404).json({
                    success: false,
                    message: 'Không tìm thấy cuộc hội thoại'
                });
            }
            // Get root conversation (the first message)
            conversationRootId = parentMessage.conversation_id || parentMessage.id;
            finalSubject = parentMessage.subject;
        }

        const supportMessage = await SupportMessage.create({
            user_id,
            guest_name: user_id ? null : guest_name,
            guest_email: user_id ? null : guest_email,
            guest_phone: user_id ? null : guest_phone,
            subject: finalSubject,
            message,
            status: conversation_id ? 'in_progress' : 'pending', // If replying, mark as in_progress
            priority: 'normal',
            parent_id: parent_id || null,
            conversation_id: conversationRootId || null,
            sender_type: 'customer'
        });

        // If this is a new conversation, set conversation_id to itself
        if (!conversationRootId) {
            await supportMessage.update({ conversation_id: supportMessage.id });
        }

        res.status(201).json({
            success: true,
            message: 'Tin nhắn của bạn đã được gửi!',
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
        const user_role = req.user.role;

        // Prevent admin/staff from accessing customer support messages
        if (user_role === 'admin' || user_role === 'staff') {
            return res.status(403).json({
                success: false,
                message: 'Admin và nhân viên không thể truy cập tin nhắn hỗ trợ của khách hàng. Vui lòng sử dụng trang quản trị.'
            });
        }

        const { page = 1, limit = 20, conversation_id } = req.query;

        // If conversation_id provided, get all messages in that conversation
        if (conversation_id) {
            const messages = await SupportMessage.findAll({
                where: {
                    [Op.or]: [
                        { conversation_id: conversation_id },
                        { id: conversation_id }
                    ],
                    [Op.or]: [
                        { user_id: user_id },
                        { sender_type: { [Op.in]: ['admin', 'staff'] } }
                    ]
                },
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'full_name', 'email'],
                        required: false
                    },
                    {
                        model: User,
                        as: 'responder',
                        attributes: ['id', 'full_name', 'email'],
                        required: false
                    }
                ],
                order: [['created_at', 'ASC']]
            });

            return res.json({
                success: true,
                data: { messages }
            });
        }

        // Otherwise, get conversation roots (first messages)
        const offset = (page - 1) * limit;

        // Get root messages (where conversation_id = id, meaning it's the first message)
        const { count, rows: messages } = await SupportMessage.findAndCountAll({
            where: {
                user_id,
                [Op.and]: [
                    sequelize.literal('SupportMessage.conversation_id = SupportMessage.id')
                ]
            },
            include: [
                {
                    model: User,
                    as: 'responder',
                    attributes: ['id', 'full_name', 'email'],
                    required: false
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
        const { page = 1, limit = 20, status, priority, conversation_id } = req.query;

        // If conversation_id provided, get all messages in that conversation
        if (conversation_id) {
            const messages = await SupportMessage.findAll({
                where: {
                    [Op.or]: [
                        { conversation_id: conversation_id },
                        { id: conversation_id }
                    ]
                },
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'full_name', 'email', 'phone'],
                        required: false
                    },
                    {
                        model: User,
                        as: 'responder',
                        attributes: ['id', 'full_name', 'email'],
                        required: false
                    }
                ],
                order: [['created_at', 'ASC']]
            });

            return res.json({
                success: true,
                data: { messages }
            });
        }

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
                    attributes: ['id', 'full_name', 'email', 'phone'],
                    required: false // Allow messages without user (guest messages)
                },
                {
                    model: User,
                    as: 'responder',
                    attributes: ['id', 'full_name', 'email'],
                    required: false // Allow messages without responder
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
        const { admin_response, status, message: replyMessage } = req.body;
        const admin_id = req.user.id;
        const admin_role = req.user.role;

        const originalMessage = await SupportMessage.findByPk(id);

        if (!originalMessage) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy tin nhắn'
            });
        }

        // Get conversation root
        const conversationId = originalMessage.conversation_id || originalMessage.id;

        // If replyMessage is provided, create a new message in the conversation
        if (replyMessage) {
            const newMessage = await SupportMessage.create({
                user_id: originalMessage.user_id,
                guest_name: originalMessage.guest_name,
                guest_email: originalMessage.guest_email,
                guest_phone: originalMessage.guest_phone,
                subject: originalMessage.subject,
                message: replyMessage,
                status: status || 'in_progress',
                priority: originalMessage.priority,
                parent_id: id,
                conversation_id: conversationId,
                sender_type: admin_role === 'admin' ? 'admin' : 'staff',
                responded_by: admin_id
            });

            // Update original message status
            await originalMessage.update({
                status: status || 'in_progress',
                responded_at: new Date(),
                responded_by: admin_id
            });

            return res.json({
                success: true,
                message: 'Đã gửi phản hồi',
                data: { message: newMessage }
            });
        }

        // Legacy: Update admin_response field (backward compatibility)
        await originalMessage.update({
            admin_response,
            status: status || 'in_progress',
            responded_at: new Date(),
            responded_by: admin_id
        });

        res.json({
            success: true,
            message: 'Đã phản hồi tin nhắn hỗ trợ',
            data: { message: originalMessage }
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

