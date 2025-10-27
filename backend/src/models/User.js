const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');
const config = require('../config/app');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: {
            msg: 'Email đã tồn tại trong hệ thống'
        },
        validate: {
            isEmail: {
                msg: 'Email không hợp lệ'
            },
            notEmpty: {
                msg: 'Email không được để trống'
            }
        }
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Mật khẩu không được để trống'
            },
            len: {
                args: [6, 100],
                msg: 'Mật khẩu phải có ít nhất 6 ký tự'
            }
        }
    },
    full_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Họ tên không được để trống'
            }
        }
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
            is: {
                args: /^[0-9+\-\s()]*$/,
                msg: 'Số điện thoại không hợp lệ'
            }
        }
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    role: {
        type: DataTypes.ENUM('admin', 'customer', 'staff'),
        defaultValue: 'customer',
        allowNull: false
    },
    avatar: {
        type: DataTypes.STRING(500),
        allowNull: true
    }
}, {
    tableName: 'users',
    timestamps: true,
    defaultScope: {
        attributes: { exclude: ['password'] } // Hide password by default
    },
    scopes: {
        withPassword: {
            attributes: {} // Include all attributes including password
        }
    },
    hooks: {
        // Hash password before creating user
        beforeCreate: async (user) => {
            if (user.password) {
                const salt = await bcrypt.genSalt(config.bcrypt_rounds);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
        // Hash password before updating user
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(config.bcrypt_rounds);
                user.password = await bcrypt.hash(user.password, salt);
            }
        }
    }
});

// Instance methods
User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password; // Don't expose password
    return values;
};

// Compare password method
User.prototype.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Class methods
User.findByEmail = async function (email) {
    return await this.findOne({ where: { email } });
};

module.exports = User;



