const jwt = require('jsonwebtoken');
const { User } = require('../models');
const config = require('../config/app');

/**
 * Middleware để xác thực JWT token
 */
const authenticate = async (req, res, next) => {
    try {
        // Lấy token từ header
        let token = req.headers.authorization;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Không tìm thấy token xác thực',
                code: 'NO_TOKEN'
            });
        }

        // Trích xuất token từ định dạng "Bearer <token>"
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }

        // Xác thực token
        const decoded = jwt.verify(token, config.jwt.secret);

        // Tìm người dùng
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

        // Gắn người dùng vào request
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
 * Middleware để kiểm tra người dùng có phải admin không
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
 * Middleware để kiểm tra người dùng có phải customer hoặc admin không
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
 * Middleware nâng cao để kiểm tra role
 * Sử dụng: authorize('admin', 'supplier')
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Chưa xác thực',
                code: 'NOT_AUTHENTICATED'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Quyền truy cập bị từ chối. Yêu cầu role: ${roles.join(', ')}`,
                code: 'FORBIDDEN'
            });
        }

        next();
    };
};

/**
 * Optional authentication - attaches user if token exists, but doesn't fail if not
 */
const optionalAuth = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (!token) {
            // No token, continue without user
            req.user = null;
            return next();
        }

        // Extract token from "Bearer <token>"
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }

        // Verify token
        const decoded = jwt.verify(token, config.jwt.secret);

        // Find user
        const user = await User.findByPk(decoded.id);

        if (user && user.is_active) {
            req.user = user;
        } else {
            req.user = null;
        }

        next();
    } catch (error) {
        // Token invalid or expired, continue without user
        req.user = null;
        next();
    }
};

/**
 * Tạo JWT token
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
 * Tạo refresh token
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
    optionalAuth,
    protect: authenticate, // Alias for authenticate
    isAdmin,
    isCustomerOrAdmin,
    authorize, // New: flexible role-based authorization
    generateToken,
    generateRefreshToken
};



