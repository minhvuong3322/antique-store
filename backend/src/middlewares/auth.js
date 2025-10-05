const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config/app');

/**
 * Middleware to verify JWT token
 */
const authenticate = async (req, res, next) => {
    try {
        // Get token from header
        let token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy token xác thực',
                code: 'NO_TOKEN'
            });
        }

        // Extract token from "Bearer <token>" format
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }

        // Verify token
        const decoded = jwt.verify(token, config.jwt.secret);

        // Find user
        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Người dùng không tồn tại',
                code: 'USER_NOT_FOUND'
            });
        }

        if (!user.is_active) {
            return res.status(401).json({
                success: false,
                message: 'Tài khoản đã bị vô hiệu hóa',
                code: 'ACCOUNT_DISABLED'
            });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token đã hết hạn',
                code: 'TOKEN_EXPIRED'
            });
        }

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Token không hợp lệ',
                code: 'INVALID_TOKEN'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Lỗi xác thực',
            error: error.message,
            code: 'AUTH_ERROR'
        });
    }
};

/**
 * Middleware to check if user is admin
 */
const isAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Chưa xác thực'
        });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Không có quyền truy cập. Chỉ dành cho admin.'
        });
    }

    next();
};

/**
 * Middleware to check if user is customer or admin
 */
const isCustomerOrAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: 'Chưa xác thực'
        });
    }

    if (req.user.role !== 'customer' && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Không có quyền truy cập'
        });
    }

    next();
};

/**
 * Generate JWT token
 */
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        config.jwt.secret,
        {
            expiresIn: config.jwt.expire
        }
    );
};

/**
 * Generate refresh token
 */
const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user.id
        },
        config.jwt.refresh_secret,
        {
            expiresIn: config.jwt.refresh_expire
        }
    );
};

module.exports = {
    authenticate,
    isAdmin,
    isCustomerOrAdmin,
    generateToken,
    generateRefreshToken
};



