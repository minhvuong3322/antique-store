const { Payment, Order } = require('../models');
const { Op } = require('sequelize');
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
 * Webhook endpoint để nhận thông báo từ app thanh toán (VNPay, Momo, etc.)
 * POST /api/v1/payments/webhook
 * 
 * Đây là endpoint để app thanh toán gọi khi đã nhận được tiền
 * Body format:
 * {
 *   order_number: string,
 *   transaction_id: string,
 *   amount: number,
 *   payment_method: 'VNPay' | 'Momo' | 'BankTransfer',
 *   status: 'success' | 'failed',
 *   signature?: string (để verify)
 * }
 */
const paymentWebhook = async (req, res, next) => {
    try {
        const { 
            order_number, 
            transaction_id, 
            amount,
            payment_method,
            status,
            signature 
        } = req.body;

        if (!order_number || !transaction_id || !payment_method) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin bắt buộc'
            });
        }

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

        // Verify amount (optional - để đảm bảo số tiền khớp)
        if (amount && parseFloat(amount) !== parseFloat(order.total_amount)) {
            console.warn(`⚠️ Amount mismatch for order ${order_number}: received ${amount}, expected ${order.total_amount}`);
        }

        // Verify signature (nếu có) - thực tế cần verify với secret key từ app thanh toán
        // if (signature) {
        //     const expectedSignature = crypto
        //         .createHash('sha256')
        //         .update(`${order_number}${transaction_id}${amount}${process.env.PAYMENT_SECRET_KEY}`)
        //         .digest('hex');
        //     
        //     if (signature !== expectedSignature) {
        //         return res.status(401).json({
        //             success: false,
        //             message: 'Invalid signature'
        //         });
        //     }
        // }

        // Cập nhật payment status
        if (status === 'success' || status === 'completed') {
            // Chỉ cập nhật nếu chưa completed (tránh duplicate processing)
            if (order.payment.payment_status !== 'completed') {
                await order.payment.update({
                    payment_status: 'completed',
                    transaction_id,
                    payment_method,
                    paid_at: new Date()
                });

                // Cập nhật order status nếu chưa confirmed
                if (order.status !== 'confirmed' && order.status !== 'processing') {
                    await order.update({ status: 'confirmed' });
                }

                console.log(`✅ Payment webhook processed: Order ${order_number} - ${transaction_id}`);
            }
        } else if (status === 'failed' || status === 'error') {
            await order.payment.update({
                payment_status: 'failed'
            });
            console.log(`❌ Payment webhook failed: Order ${order_number}`);
        }

        // Trả về success ngay để app thanh toán biết đã nhận được
        res.json({
            success: true,
            message: 'Webhook processed successfully',
            data: {
                order_number,
                payment_status: order.payment.payment_status
            }
        });
    } catch (error) {
        console.error('Payment webhook error:', error);
        next(error);
    }
};

/**
 * Check payment status by order ID or order number
 * GET /api/v1/payments/status/:identifier
 */
const checkPaymentStatus = async (req, res, next) => {
    try {
        const { identifier } = req.params;

        // Tìm order theo ID hoặc order_number
        const order = await Order.findOne({
            where: {
                [Op.or]: [
                    { id: identifier },
                    { order_number: identifier }
                ]
            },
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

        res.json({
            success: true,
            data: {
                order_id: order.id,
                order_number: order.order_number,
                order_status: order.status,
                payment: {
                    payment_status: order.payment?.payment_status || 'pending',
                    payment_method: order.payment?.payment_method || null,
                    transaction_id: order.payment?.transaction_id || null,
                    paid_at: order.payment?.paid_at || null
                }
            }
        });
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

/**
 * Create QR Code payment (VietQR)
 * POST /api/v1/payments/qrcode/create
 * 
 * Tạo mã QR thanh toán sử dụng VietQR Quick Link (giả lập)
 */
const createQRCodePayment = async (req, res, next) => {
    try {
        const { order_id } = req.body;

        if (!order_id) {
            return res.status(400).json({
                success: false,
                message: 'Thiếu thông tin đơn hàng'
            });
        }

        console.log(`Creating QR code for order ${order_id}, user ${req.user.id}`);

        const order = await Order.findOne({
            where: {
                id: order_id,
                user_id: req.user.id
            }
        });

        if (!order) {
            console.error(`Order not found: ${order_id} for user ${req.user.id}`);
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng'
            });
        }

        console.log(`Order found: ${order.order_number}, total: ${order.total_amount}`);

        // Thông tin ngân hàng giả lập (có thể cấu hình trong env)
        const bankInfo = {
            bank_id: process.env.QR_BANK_ID || 'BIDV', // Mã ngân hàng (BIDV = Ngân hàng TMCP Đầu tư và Phát triển Việt Nam)
            bank_name: process.env.QR_BANK_NAME || 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV)',
            account_number: process.env.QR_ACCOUNT_NUMBER || '6263828497',
            account_name: process.env.QR_ACCOUNT_NAME || 'TRUONG HO MINH VUONG',
            template: 'compact2' // Template QR code (compact2, print, circle)
        };

        // Số tiền (VNĐ) - không có phần thập phân
        // Convert Decimal to Number if needed
        const totalAmount = typeof order.total_amount === 'string' 
            ? parseFloat(order.total_amount) 
            : Number(order.total_amount);
        const amount = Math.round(totalAmount);

        if (!amount || amount <= 0) {
            console.error(`Invalid amount: ${amount} for order ${order_id}`);
            return res.status(400).json({
                success: false,
                message: 'Số tiền thanh toán không hợp lệ'
            });
        }

        // Nội dung chuyển khoản (mã đơn hàng để đối soát)
        // Giới hạn tối đa 25 ký tự theo chuẩn VietQR
        const paymentMessage = `THANHTOAN_${order.order_number}`.substring(0, 25);

        // Tạo QR Code URL sử dụng VietQR Quick Link
        // Format: https://img.vietqr.io/image/<BANK_ID>-<ACCOUNT_NO>-<TEMPLATE>.png?amount=<AMOUNT>&addInfo=<DESCRIPTION>&accountName=<ACCOUNT_NAME>
        const qrCodeUrl = `https://img.vietqr.io/image/${bankInfo.bank_id}-${bankInfo.account_number}-${bankInfo.template}.png?amount=${amount}&addInfo=${encodeURIComponent(paymentMessage)}&accountName=${encodeURIComponent(bankInfo.account_name)}`;

        console.log(`QR Code URL generated: ${qrCodeUrl}`);

        // Cập nhật payment method nếu chưa có
        let payment = await Payment.findOne({
            where: { order_id }
        });

        if (payment) {
            // Cập nhật payment method nếu cần
            if (!payment.payment_method || payment.payment_method === 'COD') {
                await payment.update({
                    payment_method: 'QRCode'
                });
                console.log(`Updated payment method to QRCode for order ${order_id}`);
            }
        } else {
            console.warn(`Payment record not found for order ${order_id}, but continuing...`);
        }

        const responseData = {
            success: true,
            message: 'Tạo mã QR thanh toán thành công',
            data: {
                qr_code_url: qrCodeUrl,
                bank_info: {
                    bank_name: bankInfo.bank_name,
                    account_number: bankInfo.account_number,
                    account_name: bankInfo.account_name
                },
                payment_message: paymentMessage,
                amount: amount,
                order_number: order.order_number,
                expires_at: new Date(Date.now() + 30 * 60 * 1000) // 30 phút
            }
        };

        console.log('QR Code payment created successfully');
        res.json(responseData);
    } catch (error) {
        console.error('Error creating QR code payment:', error);
        next(error);
    }
};

module.exports = {
    getPaymentByOrderId,
    processPayment,
    createVNPayPayment,
    createMomoPayment,
    createQRCodePayment,
    paymentCallback,
    paymentWebhook,
    checkPaymentStatus,
    getPaymentStats
};



