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
    verifyEmailConfig,
};

