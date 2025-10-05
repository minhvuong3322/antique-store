/**
 * OTP Controller
 * Handles OTP generation, verification, and password reset
 */
const Otp = require('../models/Otp');
const User = require('../models/User');
const { sendOTPEmail } = require('../utils/emailService');
const logger = require('../utils/logger');
const { AppError, ERROR_CODES } = require('../middlewares/errorHandler');

// Rate limiting storage (in-memory, use Redis in production)
const rateLimitStore = new Map();

/**
 * Check rate limit for OTP requests
 */
const checkRateLimit = (email) => {
    const now = Date.now();
    const key = `otp_${email}`;
    const record = rateLimitStore.get(key);

    if (!record) {
        rateLimitStore.set(key, { count: 1, resetTime: now + 5 * 60 * 1000 });
        return { allowed: true, remaining: 2 };
    }

    // Reset if time window has passed
    if (now > record.resetTime) {
        rateLimitStore.set(key, { count: 1, resetTime: now + 5 * 60 * 1000 });
        return { allowed: true, remaining: 2 };
    }

    // Check if limit exceeded (max 3 requests per 5 minutes)
    if (record.count >= 3) {
        const waitTime = Math.ceil((record.resetTime - now) / 1000 / 60);
        return { allowed: false, waitTime };
    }

    record.count++;
    return { allowed: true, remaining: 3 - record.count };
};

/**
 * @desc    Send OTP to email
 * @route   POST /api/v1/auth/send-otp
 * @access  Public
 */
exports.sendOTP = async (req, res, next) => {
    try {
        const { email, type = 'register' } = req.body;

        // Validate input
        if (!email) {
            throw new AppError('Email is required', 400, ERROR_CODES.VALIDATION_ERROR);
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new AppError('Invalid email format', 400, ERROR_CODES.VALIDATION_ERROR);
        }

        // Check rate limit
        const rateLimit = checkRateLimit(email);
        if (!rateLimit.allowed) {
            throw new AppError(
                `Too many requests. Please try again in ${rateLimit.waitTime} minutes`,
                429,
                'error.rate_limit.exceeded'
            );
        }

        // Check if email exists based on type
        const existingUser = await User.findOne({ where: { email } });

        if (type === 'register' && existingUser) {
            throw new AppError(
                'Email already registered',
                400,
                ERROR_CODES.VALIDATION_ERROR
            );
        }

        if (type === 'reset_password' && !existingUser) {
            throw new AppError(
                'Email not found',
                404,
                ERROR_CODES.NOT_FOUND
            );
        }

        // Generate and save OTP
        const otp = await Otp.createOTP(email, type, 5); // 5 minutes expiry

        // Send OTP via email
        const emailResult = await sendOTPEmail(email, otp.otp_code, type);

        if (!emailResult.success) {
            logger.error({
                message: 'Failed to send OTP email',
                email,
                error: emailResult.error,
            });
            throw new AppError(
                'Failed to send OTP. Please try again',
                500,
                ERROR_CODES.INTERNAL_SERVER
            );
        }

        logger.info({
            message: 'OTP sent successfully',
            email,
            type,
            remaining: rateLimit.remaining,
        });

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            data: {
                email,
                expires_in_minutes: 5,
                can_resend_in_seconds: 60,
                remaining_attempts: rateLimit.remaining,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Verify OTP code
 * @route   POST /api/v1/auth/verify-otp
 * @access  Public
 */
exports.verifyOTP = async (req, res, next) => {
    try {
        const { email, otp_code, type = 'register' } = req.body;

        // Validate input
        if (!email || !otp_code) {
            throw new AppError(
                'Email and OTP code are required',
                400,
                ERROR_CODES.VALIDATION_ERROR
            );
        }

        // Verify OTP
        const result = await Otp.verifyOTP(email, otp_code, type);

        if (!result.valid) {
            throw new AppError(
                result.message,
                400,
                'error.otp.invalid'
            );
        }

        logger.info({
            message: 'OTP verified successfully',
            email,
            type,
        });

        res.status(200).json({
            success: true,
            message: 'OTP verified successfully',
            data: {
                email,
                verified: true,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Reset password with OTP
 * @route   POST /api/v1/auth/reset-password
 * @access  Public
 */
exports.resetPassword = async (req, res, next) => {
    try {
        const { email, otp_code, new_password } = req.body;

        // Validate input
        if (!email || !otp_code || !new_password) {
            throw new AppError(
                'Email, OTP code, and new password are required',
                400,
                ERROR_CODES.VALIDATION_ERROR
            );
        }

        // Password validation
        if (new_password.length < 6) {
            throw new AppError(
                'Password must be at least 6 characters',
                400,
                ERROR_CODES.VALIDATION_ERROR
            );
        }

        // Verify OTP
        const result = await Otp.verifyOTP(email, otp_code, 'reset_password');

        if (!result.valid) {
            throw new AppError(
                result.message,
                400,
                'error.otp.invalid'
            );
        }

        // Find user
        const user = await User.findOne({ where: { email } });

        if (!user) {
            throw new AppError(
                'User not found',
                404,
                ERROR_CODES.NOT_FOUND
            );
        }

        // Update password (will be hashed by User model hook)
        user.password = new_password;
        await user.save();

        // Mark OTP as used after successful password reset
        await Otp.update(
            { is_used: true },
            {
                where: {
                    email,
                    otp_code,
                    type: 'reset_password',
                    is_used: false,
                },
            }
        );

        logger.info({
            message: 'Password reset successfully',
            email,
            userId: user.id,
        });

        res.status(200).json({
            success: true,
            message: 'Password reset successfully',
            data: {
                email: user.email,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Resend OTP (with rate limiting)
 * @route   POST /api/v1/auth/resend-otp
 * @access  Public
 */
exports.resendOTP = async (req, res, next) => {
    try {
        const { email, type = 'register' } = req.body;

        if (!email) {
            throw new AppError('Email is required', 400, ERROR_CODES.VALIDATION_ERROR);
        }

        // Check rate limit
        const rateLimit = checkRateLimit(email);
        if (!rateLimit.allowed) {
            throw new AppError(
                `Too many requests. Please try again in ${rateLimit.waitTime} minutes`,
                429,
                'error.rate_limit.exceeded'
            );
        }

        // Generate new OTP
        const otp = await Otp.createOTP(email, type, 5);

        // Send OTP via email
        const emailResult = await sendOTPEmail(email, otp.otp_code, type);

        if (!emailResult.success) {
            throw new AppError(
                'Failed to send OTP. Please try again',
                500,
                ERROR_CODES.INTERNAL_SERVER
            );
        }

        logger.info({
            message: 'OTP resent successfully',
            email,
            type,
        });

        res.status(200).json({
            success: true,
            message: 'OTP resent successfully',
            data: {
                email,
                expires_in_minutes: 5,
                remaining_attempts: rateLimit.remaining,
            },
        });
    } catch (error) {
        next(error);
    }
};

