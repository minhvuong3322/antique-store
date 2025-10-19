const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/auth');
const { validate } = require('../middlewares/validate');

// Validation rules
const registerValidation = [
    body('email').isEmail().withMessage('Email không hợp lệ'),
    body('password').isLength({ min: 6 }).withMessage('Mật khẩu phải có ít nhất 6 ký tự'),
    body('full_name').notEmpty().withMessage('Họ tên không được để trống'),
    validate
];

const loginValidation = [
    body('email').isEmail().withMessage('Email không hợp lệ'),
    body('password').notEmpty().withMessage('Mật khẩu không được để trống'),
    validate
];

const changePasswordValidation = [
    body('current_password').notEmpty().withMessage('Mật khẩu hiện tại không được để trống'),
    body('new_password').isLength({ min: 6 }).withMessage('Mật khẩu mới phải có ít nhất 6 ký tự'),
    validate
];

// OAuth validation
const googleLoginValidation = [
    body('idToken').notEmpty().withMessage('Google ID Token là bắt buộc'),
    validate
];

const facebookLoginValidation = [
    body('accessToken').notEmpty().withMessage('Facebook access token là bắt buộc'),
    body('userID').notEmpty().withMessage('Facebook userID là bắt buộc'),
    validate
];

// Routes
router.post('/register', registerValidation, authController.register);
router.post('/login', loginValidation, authController.login);
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);
router.put('/change-password', authenticate, changePasswordValidation, authController.changePassword);

// OAuth routes
router.post('/google', googleLoginValidation, authController.googleLogin);
router.post('/facebook', facebookLoginValidation, authController.facebookLogin);

module.exports = router;



