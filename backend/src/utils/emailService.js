/**
 * Email Service
 * Handles sending emails using nodemailer
 */
const nodemailer = require('nodemailer');
const logger = require('./logger');

// Create reusable transporter
let transporter = null;

/**
 * Initialize email transporter
 */
const initializeTransporter = () => {
    if (transporter) return transporter;

    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    logger.info('Email transporter initialized');
    return transporter;
};

/**
 * Send OTP email
 */
const sendOTPEmail = async (email, otp_code, type = 'register') => {
    try {
        const transporter = initializeTransporter();

        // Email content based on type
        const subjects = {
            register: 'Xác Thực Đăng Ký Tài Khoản - Antique Store',
            reset_password: 'Đặt Lại Mật Khẩu - Antique Store',
            verify_email: 'Xác Thực Email - Antique Store',
        };

        const messages = {
            register: 'Vui lòng sử dụng mã OTP sau để hoàn tất đăng ký tài khoản:',
            reset_password: 'Vui lòng sử dụng mã OTP sau để đặt lại mật khẩu:',
            verify_email: 'Vui lòng sử dụng mã OTP sau để xác thực email:',
        };

        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">
                                🏛️ Antique Store
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 20px; color: #333333; font-size: 24px;">
                                Mã Xác Thực OTP
                            </h2>
                            
                            <p style="margin: 0 0 20px; color: #666666; font-size: 16px; line-height: 1.6;">
                                ${messages[type]}
                            </p>
                            
                            <!-- OTP Code Box -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <div style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; padding: 20px 40px;">
                                            <span style="color: #ffffff; font-size: 36px; font-weight: bold; letter-spacing: 8px;">
                                                ${otp_code}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Warning -->
                            <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
                                <p style="margin: 0; color: #856404; font-size: 14px;">
                                    ⚠️ <strong>Lưu ý:</strong> Mã OTP này sẽ hết hạn sau <strong>5 phút</strong>.
                                </p>
                            </div>
                            
                            <p style="margin: 20px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                                Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px 40px; text-align: center; background-color: #f8f9fa; border-radius: 0 0 8px 8px;">
                            <p style="margin: 0; color: #999999; font-size: 12px;">
                                © 2025 Antique Store. All rights reserved.
                            </p>
                            <p style="margin: 10px 0 0; color: #999999; font-size: 12px;">
                                Email được gửi tự động, vui lòng không trả lời.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `;

        const textContent = `
Antique Store - Mã Xác Thực OTP

${messages[type]}

Mã OTP của bạn: ${otp_code}

⚠️ Lưu ý: Mã OTP này sẽ hết hạn sau 5 phút.

Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.

© 2025 Antique Store. All rights reserved.
        `;

        // Send mail
        const info = await transporter.sendMail({
            from: `"Antique Store" <${process.env.SMTP_USER}>`,
            to: email,
            subject: subjects[type] || subjects.register,
            text: textContent,
            html: htmlContent,
        });

        logger.info({
            message: 'OTP email sent successfully',
            email,
            type,
            messageId: info.messageId,
        });

        return {
            success: true,
            messageId: info.messageId,
        };
    } catch (error) {
        logger.logError(error, {
            operation: 'sendOTPEmail',
            email,
            type,
        });

        return {
            success: false,
            error: error.message,
        };
    }
};

/**
 * Send welcome email after successful registration
 */
const sendWelcomeEmail = async (email, full_name) => {
    try {
        const transporter = initializeTransporter();

        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Welcome</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px;">
                    <tr>
                        <td style="padding: 40px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px;">
                                🏛️ Chào Mừng Đến Với Antique Store!
                            </h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 20px; color: #333333;">
                                Xin chào ${full_name}!
                            </h2>
                            <p style="color: #666666; font-size: 16px; line-height: 1.6;">
                                Cảm ơn bạn đã đăng ký tài khoản tại <strong>Antique Store</strong> - nơi lưu giữ và tôn vinh giá trị của thời gian.
                            </p>
                            <p style="color: #666666; font-size: 16px; line-height: 1.6;">
                                Bạn có thể bắt đầu khám phá bộ sưu tập đồ cổ độc đáo của chúng tôi ngay bây giờ!
                            </p>
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="http://localhost:5173/products" style="display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
                                            Khám Phá Ngay
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px 40px; text-align: center; background-color: #f8f9fa; border-radius: 0 0 8px 8px;">
                            <p style="margin: 0; color: #999999; font-size: 12px;">
                                © 2025 Antique Store. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `;

        await transporter.sendMail({
            from: `"Antique Store" <${process.env.SMTP_USER}>`,
            to: email,
            subject: 'Chào Mừng Đến Với Antique Store! 🏛️',
            html: htmlContent,
        });

        logger.info({ message: 'Welcome email sent', email });
        return { success: true };
    } catch (error) {
        logger.logError(error, { operation: 'sendWelcomeEmail', email });
        return { success: false, error: error.message };
    }
};

/**
 * Send Order Confirmation Email
 */
const sendOrderConfirmationEmail = async (email, orderData) => {
    try {
        const transporter = initializeTransporter();

        const { order_number, total_amount, order_details, shipping_address } = orderData;

        // Build product list HTML
        const productsHTML = order_details.map(item => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                    ${item.Product?.name || 'Sản phẩm'}
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">
                    ${item.quantity}
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
                    ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.unit_price)}
                </td>
            </tr>
        `).join('');

        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px;">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px; text-align: center; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px;">
                                ✅ Đơn Hàng Đã Được Xác Nhận!
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 20px; color: #333333;">
                                Cảm ơn bạn đã đặt hàng tại Antique Store!
                            </h2>
                            
                            <p style="color: #666666; font-size: 16px; line-height: 1.6;">
                                Đơn hàng <strong>#${order_number}</strong> của bạn đã được xác nhận và đang được xử lý.
                            </p>
                            
                            <!-- Order Details -->
                            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                <h3 style="margin: 0 0 15px; color: #333;">Chi Tiết Đơn Hàng</h3>
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <thead>
                                        <tr style="background-color: #e9ecef;">
                                            <th style="padding: 10px; text-align: left;">Sản phẩm</th>
                                            <th style="padding: 10px; text-align: center;">SL</th>
                                            <th style="padding: 10px; text-align: right;">Giá</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${productsHTML}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colspan="2" style="padding: 15px 10px 10px; text-align: right; font-weight: bold;">
                                                Tổng cộng:
                                            </td>
                                            <td style="padding: 15px 10px 10px; text-align: right; font-weight: bold; color: #10b981; font-size: 18px;">
                                                ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(total_amount)}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            
                            <!-- Shipping Address -->
                            <div style="margin: 20px 0;">
                                <h3 style="margin: 0 0 10px; color: #333;">Địa Chỉ Giao Hàng</h3>
                                <p style="color: #666; margin: 0; line-height: 1.6;">
                                    ${shipping_address}
                                </p>
                            </div>
                            
                            <p style="color: #666666; font-size: 14px; margin-top: 20px;">
                                Chúng tôi sẽ thông báo cho bạn khi đơn hàng được giao đi.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px 40px; text-align: center; background-color: #f8f9fa; border-radius: 0 0 8px 8px;">
                            <p style="margin: 0; color: #999999; font-size: 12px;">
                                © 2025 Antique Store. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `;

        await transporter.sendMail({
            from: `"Antique Store" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `✅ Xác Nhận Đơn Hàng #${order_number}`,
            html: htmlContent,
        });

        logger.info({ message: 'Order confirmation email sent', email, order_number });
        return { success: true };
    } catch (error) {
        logger.logError(error, { operation: 'sendOrderConfirmationEmail', email });
        return { success: false, error: error.message };
    }
};

/**
 * Send Order Status Update Email
 */
const sendOrderStatusUpdateEmail = async (email, orderData) => {
    try {
        const transporter = initializeTransporter();

        const { order_number, status } = orderData;

        const statusMessages = {
            confirmed: {
                title: '✅ Đơn Hàng Đã Được Xác Nhận',
                message: 'Đơn hàng của bạn đã được xác nhận và đang được chuẩn bị.',
                color: '#10b981'
            },
            shipping: {
                title: '🚚 Đơn Hàng Đang Được Giao',
                message: 'Đơn hàng của bạn đang trên đường giao đến địa chỉ của bạn.',
                color: '#6366f1'
            },
            delivered: {
                title: '✨ Đơn Hàng Đã Giao Thành Công',
                message: 'Đơn hàng của bạn đã được giao thành công. Cảm ơn bạn đã mua hàng!',
                color: '#8b5cf6'
            },
            cancelled: {
                title: '❌ Đơn Hàng Đã Bị Hủy',
                message: 'Đơn hàng của bạn đã bị hủy. Vui lòng liên hệ với chúng tôi nếu có thắc mắc.',
                color: '#ef4444'
            }
        };

        const statusInfo = statusMessages[status] || statusMessages.confirmed;

        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Order Status Update</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px;">
                    <tr>
                        <td style="padding: 40px; text-align: center; background-color: ${statusInfo.color}; border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px;">
                                ${statusInfo.title}
                            </h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px;">
                            <p style="color: #666666; font-size: 16px; line-height: 1.6;">
                                Đơn hàng <strong>#${order_number}</strong> đã được cập nhật.
                            </p>
                            <p style="color: #666666; font-size: 16px; line-height: 1.6;">
                                ${statusInfo.message}
                            </p>
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="http://localhost:5173/my-orders" style="display: inline-block; padding: 15px 40px; background-color: ${statusInfo.color}; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold;">
                                            Xem Chi Tiết Đơn Hàng
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 20px 40px; text-align: center; background-color: #f8f9fa; border-radius: 0 0 8px 8px;">
                            <p style="margin: 0; color: #999999; font-size: 12px;">
                                © 2025 Antique Store. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `;

        await transporter.sendMail({
            from: `"Antique Store" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `${statusInfo.title} - Đơn Hàng #${order_number}`,
            html: htmlContent,
        });

        logger.info({ message: 'Order status update email sent', email, order_number, status });
        return { success: true };
    } catch (error) {
        logger.logError(error, { operation: 'sendOrderStatusUpdateEmail', email });
        return { success: false, error: error.message };
    }
};

/**
 * Verify email configuration
 */
const verifyEmailConfig = async () => {
    try {
        const transporter = initializeTransporter();
        await transporter.verify();
        logger.info('Email configuration verified successfully');
        return true;
    } catch (error) {
        logger.error('Email configuration verification failed:', error.message);
        return false;
    }
};

module.exports = {
    sendOTPEmail,
    sendWelcomeEmail,
    sendOrderConfirmationEmail,
    sendOrderStatusUpdateEmail,
    verifyEmailConfig,
};

