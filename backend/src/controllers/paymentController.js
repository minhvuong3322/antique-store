const { Payment, Order } = require('../models');
const crypto = require('crypto');

/**
 * Get payment by order ID
 * GET /api/v1/payments/order/:orderId
 */
const getPaymentByOrderId = async (req, res, next) => {
    try {
        const { orderId } = req.params;

        const payment = await Payment.findOne({
            where: { order_id: orderId },
            include: [
                {
                    model: Order,
                    as: 'order',
                    attributes: ['id', 'order_number', 'total_amount', 'status']
                }
            ]
        });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy thông tin thanh toán'
            });
        }

        res.json({
            success: true,
            data: { payment }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Process payment (Mock - COD)
 * POST /api/v1/payments/process
 */
const processPayment = async (req, res, next) => {
    try {
        const { order_id, payment_method = 'COD' } = req.body;

        const order = await Order.findByPk(order_id, {
            where: { user_id: req.user.id }
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        const payment = await Payment.findOne({
            where: { order_id }
        });

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy thông tin thanh toán'
            });
        }

        if (payment.payment_status === 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Đơn hàng đã được thanh toán'
            });
        }

        // Mock payment processing
        if (payment_method === 'COD') {
            // COD - Cash on Delivery (payment will be completed when delivered)
            await payment.update({
                payment_method: 'COD',
                payment_status: 'pending'
            });

            return res.json({
                success: true,
                message: 'Đặt hàng thành công. Thanh toán khi nhận hàng (COD)',
                data: { payment }
            });
        }

        // Mock online payment (VNPay, Momo, etc.)
        const transaction_id = crypto.randomBytes(16).toString('hex');

        await payment.update({
            payment_method,
            payment_status: 'completed',
            transaction_id,
            paid_at: new Date()
        });

        await order.update({ status: 'confirmed' });

        res.json({
            success: true,
            message: 'Thanh toán thành công',
            data: {
                payment,
                transaction_id
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Mock VNPay payment URL generation
 * POST /api/v1/payments/vnpay/create
 */
const createVNPayPayment = async (req, res, next) => {
    try {
        const { order_id } = req.body;

        const order = await Order.findByPk(order_id, {
            where: { user_id: req.user.id }
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        // Mock VNPay payment URL
        const mockPaymentUrl = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=${order.total_amount * 100}&vnp_OrderInfo=${order.order_number}&vnp_TxnRef=${order.order_number}`;

        res.json({
            success: true,
            message: 'Tạo link thanh toán VNPay thành công',
            data: {
                payment_url: mockPaymentUrl,
                order_number: order.order_number
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Mock Momo payment URL generation
 * POST /api/v1/payments/momo/create
 */
const createMomoPayment = async (req, res, next) => {
    try {
        const { order_id } = req.body;

        const order = await Order.findByPk(order_id, {
            where: { user_id: req.user.id }
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        // Mock Momo payment URL
        const mockPaymentUrl = `https://test-payment.momo.vn/gw_payment/payment?partnerCode=MOMO&orderId=${order.order_number}&amount=${order.total_amount}`;

        res.json({
            success: true,
            message: 'Tạo link thanh toán Momo thành công',
            data: {
                payment_url: mockPaymentUrl,
                order_number: order.order_number
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Mock payment callback (VNPay/Momo return URL)
 * GET /api/v1/payments/callback
 */
const paymentCallback = async (req, res, next) => {
    try {
        const { order_number, status = 'success', transaction_id } = req.query;

        const order = await Order.findOne({
            where: { order_number },
            include: [
                {
                    model: Payment,
                    as: 'payment'
                }
            ]
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        if (status === 'success') {
            await order.payment.update({
                payment_status: 'completed',
                transaction_id: transaction_id || crypto.randomBytes(16).toString('hex'),
                paid_at: new Date()
            });

            await order.update({ status: 'confirmed' });

            res.json({
                success: true,
                message: 'Thanh toán thành công',
                data: {
                    order,
                    payment: order.payment
                }
            });
        } else {
            await order.payment.update({
                payment_status: 'failed'
            });

            res.status(400).json({
                success: false,
                message: 'Thanh toán thất bại'
            });
        }
    } catch (error) {
        next(error);
    }
};

/**
 * Get payment statistics (Admin only)
 * GET /api/v1/admin/payments/stats
 */
const getPaymentStats = async (req, res, next) => {
    try {
        const { sequelize } = require('../config/database');

        const stats = await Payment.findAll({
            attributes: [
                'payment_method',
                'payment_status',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('SUM', sequelize.col('amount')), 'total_amount']
            ],
            group: ['payment_method', 'payment_status']
        });

        res.json({
            success: true,
            data: { stats }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getPaymentByOrderId,
    processPayment,
    createVNPayPayment,
    createMomoPayment,
    paymentCallback,
    getPaymentStats
};



