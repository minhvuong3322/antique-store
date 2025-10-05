/**
 * OTP Routes
 * Handles OTP-related endpoints
 */
const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otpController');
const { body } = require('express-validator');
const { validate } = require('../middlewares/validate');

/**
 * @route   POST /api/v1/otp/send
 * @desc    Send OTP to email
 * @access  Public
 */
router.post(
    '/send',
    [
        body('email')
            .isEmail()
            .withMessage('Must be a valid email')
            .normalizeEmail(),
        body('type')
            .optional()
            .isIn(['register', 'reset_password', 'verify_email'])
            .withMessage('Invalid OTP type'),
        validate,
    ],
    otpController.sendOTP
);

/**
 * @route   POST /api/v1/otp/verify
 * @desc    Verify OTP code
 * @access  Public
 */
router.post(
    '/verify',
    [
        body('email')
            .isEmail()
            .withMessage('Must be a valid email')
            .normalizeEmail(),
        body('otp_code')
            .isLength({ min: 6, max: 6 })
            .withMessage('OTP code must be 6 digits')
            .isNumeric()
            .withMessage('OTP code must contain only numbers'),
        body('type')
            .optional()
            .isIn(['register', 'reset_password', 'verify_email'])
            .withMessage('Invalid OTP type'),
        validate,
    ],
    otpController.verifyOTP
);

/**
 * @route   POST /api/v1/otp/reset-password
 * @desc    Reset password with OTP
 * @access  Public
 */
router.post(
    '/reset-password',
    [
        body('email')
            .isEmail()
            .withMessage('Must be a valid email')
            .normalizeEmail(),
        body('otp_code')
            .isLength({ min: 6, max: 6 })
            .withMessage('OTP code must be 6 digits')
            .isNumeric()
            .withMessage('OTP code must contain only numbers'),
        body('new_password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters'),
        validate,
    ],
    otpController.resetPassword
);

/**
 * @route   POST /api/v1/otp/resend
 * @desc    Resend OTP code
 * @access  Public
 */
router.post(
    '/resend',
    [
        body('email')
            .isEmail()
            .withMessage('Must be a valid email')
            .normalizeEmail(),
        body('type')
            .optional()
            .isIn(['register', 'reset_password', 'verify_email'])
            .withMessage('Invalid OTP type'),
        validate,
    ],
    otpController.resendOTP
);

module.exports = router;

