const { User } = require('../models');
const { generateToken, generateRefreshToken } = require('../middlewares/auth');

/**
 * Register new user
 * POST /api/v1/auth/register
 */
const register = async (req, res, next) => {
    try {
        const { email, password, full_name, phone, address } = req.body;

        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email đã được đăng ký'
            });
        }

        // Create new user
        const user = await User.create({
            email,
            password,
            full_name,
            phone,
            address,
            role: 'customer'
        });

        // Generate tokens
        const token = generateToken(user);
        const refreshToken = generateRefreshToken(user);

        res.status(201).json({
            success: true,
            message: 'Đăng ký thành công',
            data: {
                user: user.toJSON(),
                token,
                refreshToken
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Login user
 * POST /api/v1/auth/login
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.scope('withPassword').findByEmail(email);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Email hoặc mật khẩu không chính xác'
            });
        }

        // Check if user is active
        if (!user.is_active) {
            return res.status(401).json({
                success: false,
                message: 'Tài khoản đã bị vô hiệu hóa'
            });
        }

        // Compare password
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Email hoặc mật khẩu không chính xác'
            });
        }

        // Generate tokens
        const token = generateToken(user);
        const refreshToken = generateRefreshToken(user);

        res.json({
            success: true,
            message: 'Đăng nhập thành công',
            data: {
                user: user.toJSON(),
                token,
                refreshToken
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get current user profile
 * GET /api/v1/auth/profile
 */
const getProfile = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }

        res.json({
            success: true,
            data: {
                user: user.toJSON()
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update user profile
 * PUT /api/v1/auth/profile
 */
const updateProfile = async (req, res, next) => {
    try {
        const { full_name, phone, address, avatar } = req.body;
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }

        // Update user info
        await user.update({
            full_name: full_name || user.full_name,
            phone: phone || user.phone,
            address: address || user.address,
            avatar: avatar || user.avatar
        });

        res.json({
            success: true,
            message: 'Cập nhật thông tin thành công',
            data: {
                user: user.toJSON()
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Change password
 * PUT /api/v1/auth/change-password
 */
const changePassword = async (req, res, next) => {
    try {
        const { current_password, new_password } = req.body;

        // Get user with password
        const user = await User.scope('withPassword').findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy người dùng'
            });
        }

        // Verify current password
        const isPasswordValid = await user.comparePassword(current_password);

        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: 'Mật khẩu hiện tại không chính xác'
            });
        }

        // Update password
        user.password = new_password;
        await user.save();

        res.json({
            success: true,
            message: 'Đổi mật khẩu thành công'
        });
    } catch (error) {
        next(error);
    }
};

// Add scope to include password for login
User.addScope('withPassword', {
    attributes: { include: ['password'] }
});

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword
};



