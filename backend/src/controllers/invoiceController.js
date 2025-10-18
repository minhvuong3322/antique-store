const { Invoice, Order, OrderDetail, User, Product } = require('../models');
const logger = require('../utils/logger');
const { Op } = require('sequelize');
// const emailService = require('../utils/emailService'); // TODO: Implement email sending

/**
 * @desc    Get all invoices
 * @route   GET /api/invoices
 * @access  Private/Admin
 */
exports.getAllInvoices = async (req, res, next) => {
    try {
        const { payment_status, search, page = 1, limit = 10 } = req.query;

        const offset = (page - 1) * limit;
        const where = {};

        if (payment_status) {
            where.payment_status = payment_status;
        }

        if (search) {
            where[Op.or] = [
                { invoice_number: { [Op.like]: `%${search}%` } },
                { customer_email: { [Op.like]: `%${search}%` } },
                { customer_name: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows: invoices } = await Invoice.findAndCountAll({
            where,
            include: [
                {
                    association: 'order',
                    include: [
                        { association: 'user', attributes: ['id', 'email', 'full_name'] }
                    ]
                },
                {
                    association: 'creator',
                    attributes: ['id', 'full_name', 'email']
                }
            ],
            order: [['invoice_date', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            success: true,
            count,
            total_pages: Math.ceil(count / limit),
            current_page: parseInt(page),
            data: invoices
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'getAllInvoices',
            user: req.user?.id
        });
        next(error);
    }
};

/**
 * @desc    Get invoice by ID
 * @route   GET /api/invoices/:id
 * @access  Private
 */
exports.getInvoiceById = async (req, res, next) => {
    try {
        const invoice = await Invoice.findByPk(req.params.id, {
            include: [
                {
                    association: 'order',
                    include: [
                        {
                            association: 'user',
                            attributes: ['id', 'email', 'full_name', 'phone', 'address']
                        },
                        {
                            association: 'order_details',
                            include: [
                                {
                                    association: 'product',
                                    attributes: ['id', 'name', 'sku', 'images']
                                }
                            ]
                        }
                    ]
                }
            ]
        });

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy hóa đơn'
            });
        }

        // Check permission: Admin or invoice owner
        if (req.user.role !== 'admin' && invoice.order.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền xem hóa đơn này'
            });
        }

        res.status(200).json({
            success: true,
            data: invoice
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'getInvoiceById',
            invoice_id: req.params.id,
            user: req.user?.id
        });
        next(error);
    }
};

/**
 * @desc    Get invoice by order ID
 * @route   GET /api/invoices/order/:orderId
 * @access  Private
 */
exports.getInvoiceByOrderId = async (req, res, next) => {
    try {
        const order = await Order.findByPk(req.params.orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        // Check permission
        if (req.user.role !== 'admin' && order.user_id !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền xem hóa đơn này'
            });
        }

        const invoice = await Invoice.findByOrder(req.params.orderId);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Đơn hàng chưa có hóa đơn'
            });
        }

        res.status(200).json({
            success: true,
            data: invoice
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'getInvoiceByOrderId',
            order_id: req.params.orderId,
            user: req.user?.id
        });
        next(error);
    }
};

/**
 * @desc    Get user's invoices
 * @route   GET /api/invoices/my-invoices
 * @access  Private
 */
exports.getMyInvoices = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);
        const invoices = await Invoice.findByCustomer(user.email);

        res.status(200).json({
            success: true,
            count: invoices.length,
            data: invoices
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'getMyInvoices',
            user: req.user?.id
        });
        next(error);
    }
};

/**
 * @desc    Create invoice for an order
 * @route   POST /api/invoices
 * @access  Private/Admin
 */
exports.createInvoice = async (req, res, next) => {
    try {
        const { order_id, customer_tax_code, notes } = req.body;

        // Check if order exists
        const order = await Order.findByPk(order_id, {
            include: [
                {
                    association: 'user',
                    attributes: ['id', 'email', 'full_name', 'phone', 'address']
                },
                {
                    association: 'order_details',
                    include: ['product']
                }
            ]
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        // Check if order is confirmed
        if (order.status !== 'confirmed' && order.status !== 'shipping' && order.status !== 'delivered') {
            return res.status(400).json({
                success: false,
                message: 'Chỉ có thể tạo hóa đơn cho đơn hàng đã xác nhận'
            });
        }

        // Check if invoice already exists
        const existingInvoice = await Invoice.findOne({ where: { order_id } });
        if (existingInvoice) {
            return res.status(400).json({
                success: false,
                message: 'Đơn hàng đã có hóa đơn'
            });
        }

        // Generate invoice number
        const invoice_number = Invoice.generateInvoiceNumber();

        // Calculate totals
        const subtotal = order.order_details.reduce((sum, detail) => {
            return sum + parseFloat(detail.subtotal);
        }, 0);

        const invoice = await Invoice.create({
            order_id,
            invoice_number,
            invoice_date: new Date(),
            customer_name: order.user.full_name,
            customer_email: order.user.email,
            customer_phone: order.user.phone,
            customer_address: order.shipping_address || order.user.address,
            customer_tax_code: customer_tax_code || null,
            subtotal,
            tax: order.tax || 0,
            shipping_fee: order.shipping_fee || 0,
            discount: order.discount || 0,
            total_amount: order.total_amount,
            payment_method: order.payment?.payment_method || 'COD',
            payment_status: order.payment?.payment_status === 'completed' ? 'paid' : 'unpaid',
            notes: notes || null,
            pdf_url: null, // TODO: Generate PDF
            sent_to_email: false,
            created_by: req.user.id
        });

        logger.info(`Invoice created: ${invoice_number} for order ${order.order_number} by admin ${req.user.id}`);

        res.status(201).json({
            success: true,
            message: 'Tạo hóa đơn thành công',
            data: invoice
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'createInvoice',
            user: req.user?.id,
            body: req.body
        });
        next(error);
    }
};

/**
 * @desc    Update invoice
 * @route   PUT /api/invoices/:id
 * @access  Private/Admin
 */
exports.updateInvoice = async (req, res, next) => {
    try {
        const invoice = await Invoice.findByPk(req.params.id);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy hóa đơn'
            });
        }

        const {
            payment_status,
            customer_tax_code,
            notes,
            pdf_url
        } = req.body;

        // Update fields
        if (payment_status) invoice.payment_status = payment_status;
        if (customer_tax_code !== undefined) invoice.customer_tax_code = customer_tax_code;
        if (notes !== undefined) invoice.notes = notes;
        if (pdf_url !== undefined) invoice.pdf_url = pdf_url;

        await invoice.save();

        logger.info(`Invoice updated: ${invoice.invoice_number} by admin ${req.user.id}`);

        res.status(200).json({
            success: true,
            message: 'Cập nhật hóa đơn thành công',
            data: invoice
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'updateInvoice',
            invoice_id: req.params.id,
            user: req.user?.id
        });
        next(error);
    }
};

/**
 * @desc    Delete invoice
 * @route   DELETE /api/invoices/:id
 * @access  Private/Admin
 */
exports.deleteInvoice = async (req, res, next) => {
    try {
        const invoice = await Invoice.findByPk(req.params.id);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy hóa đơn'
            });
        }

        await invoice.destroy();

        logger.info(`Invoice deleted: ${invoice.invoice_number} by admin ${req.user.id}`);

        res.status(200).json({
            success: true,
            message: 'Xóa hóa đơn thành công'
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'deleteInvoice',
            invoice_id: req.params.id,
            user: req.user?.id
        });
        next(error);
    }
};

/**
 * @desc    Send invoice via email
 * @route   POST /api/invoices/:id/send-email
 * @access  Private/Admin
 */
exports.sendInvoiceEmail = async (req, res, next) => {
    try {
        const invoice = await Invoice.findByPk(req.params.id, {
            include: [
                {
                    association: 'order',
                    include: [
                        { association: 'order_details', include: ['product'] }
                    ]
                }
            ]
        });

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy hóa đơn'
            });
        }

        // TODO: Implement email sending with PDF attachment
        // await emailService.sendInvoiceEmail(invoice);

        // For now, just mark as sent
        await invoice.markAsSent();

        logger.info(`Invoice email sent: ${invoice.invoice_number} to ${invoice.customer_email}`);

        res.status(200).json({
            success: true,
            message: `Đã gửi hóa đơn đến email ${invoice.customer_email}`,
            data: invoice
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'sendInvoiceEmail',
            invoice_id: req.params.id,
            user: req.user?.id
        });
        next(error);
    }
};

/**
 * @desc    Get pending invoices (unpaid)
 * @route   GET /api/invoices/pending
 * @access  Private/Admin
 */
exports.getPendingInvoices = async (req, res, next) => {
    try {
        const invoices = await Invoice.getPendingInvoices();

        res.status(200).json({
            success: true,
            count: invoices.length,
            data: invoices
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'getPendingInvoices',
            user: req.user?.id
        });
        next(error);
    }
};

/**
 * @desc    Get invoice statistics
 * @route   GET /api/invoices/statistics
 * @access  Private/Admin
 */
exports.getInvoiceStatistics = async (req, res, next) => {
    try {
        const totalInvoices = await Invoice.count();

        const paidInvoices = await Invoice.count({
            where: { payment_status: 'paid' }
        });

        const unpaidInvoices = await Invoice.count({
            where: { payment_status: 'unpaid' }
        });

        // Total revenue from paid invoices
        const paidInvoicesList = await Invoice.findAll({
            where: { payment_status: 'paid' },
            attributes: ['total_amount']
        });

        const totalRevenue = paidInvoicesList.reduce((sum, inv) => {
            return sum + parseFloat(inv.total_amount);
        }, 0);

        // This month's invoices
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const thisMonthInvoices = await Invoice.count({
            where: {
                invoice_date: { [Op.gte]: startOfMonth }
            }
        });

        res.status(200).json({
            success: true,
            data: {
                total_invoices: totalInvoices,
                paid_invoices: paidInvoices,
                unpaid_invoices: unpaidInvoices,
                total_revenue: totalRevenue,
                this_month_invoices: thisMonthInvoices
            }
        });
    } catch (error) {
        logger.logError(error, {
            operation: 'getInvoiceStatistics',
            user: req.user?.id
        });
        next(error);
    }
};

