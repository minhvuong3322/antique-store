/**
 * OTP Model
 * Manages one-time passwords for authentication
 */
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Otp = sequelize.define('Otp', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Must be a valid email address',
            },
        },
    },
    otp_code: {
        type: DataTypes.STRING(6),
        allowNull: false,
        validate: {
            len: {
                args: [6, 6],
                msg: 'OTP code must be exactly 6 characters',
            },
        },
    },
    type: {
        type: DataTypes.ENUM('register', 'reset_password', 'verify_email'),
        allowNull: false,
        defaultValue: 'register',
    },
    is_used: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    tableName: 'otps',
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ['email'] },
        { fields: ['otp_code'] },
        { fields: ['expires_at'] },
        { fields: ['type'] },
    ],
});

/**
 * Generate random 6-digit OTP code
 */
Otp.generateCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Create new OTP with expiration
 */
Otp.createOTP = async (email, type = 'register', expiryMinutes = 5) => {
    const otp_code = Otp.generateCode();
    const expires_at = new Date(Date.now() + expiryMinutes * 60 * 1000);

    // Invalidate all previous OTPs for this email and type
    await Otp.update(
        { is_used: true },
        {
            where: {
                email,
                type,
                is_used: false,
            },
        }
    );

    // Create new OTP
    const otp = await Otp.create({
        email,
        otp_code,
        type,
        expires_at,
    });

    return otp;
};

/**
 * Verify OTP code
 */
Otp.verifyOTP = async (email, otp_code, type = 'register') => {
    const otp = await Otp.findOne({
        where: {
            email,
            otp_code,
            type,
            is_used: false,
        },
    });

    if (!otp) {
        return { valid: false, message: 'Invalid OTP code' };
    }

    // Check expiration
    if (new Date() > new Date(otp.expires_at)) {
        return { valid: false, message: 'OTP code has expired' };
    }

    // For password reset, don't mark as used yet - only mark as used after password is reset
    if (type === 'reset_password') {
        return { valid: true, message: 'OTP verified successfully', otp };
    }

    // Mark as used for other types (register, verify_email)
    await otp.update({ is_used: true });

    return { valid: true, message: 'OTP verified successfully', otp };
};

/**
 * Clean up expired OTPs (run periodically)
 */
Otp.cleanupExpired = async () => {
    const deleted = await Otp.destroy({
        where: {
            expires_at: {
                [sequelize.Sequelize.Op.lt]: new Date(),
            },
        },
    });
    return deleted;
};

module.exports = Otp;

