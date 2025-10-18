const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Supplier = sequelize.define('Supplier', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Link to users table if supplier has login account'
    },
    company_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Tên công ty không được để trống'
            }
        }
    },
    contact_person: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Người liên hệ không được để trống'
            }
        }
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: {
            msg: 'Email nhà cung cấp đã tồn tại'
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
    phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Số điện thoại không được để trống'
            },
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
    tax_code: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Mã số thuế'
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'suppliers',
    timestamps: true,
    indexes: [
        {
            unique: false,
            fields: ['email']
        },
        {
            unique: false,
            fields: ['user_id']
        },
        {
            unique: false,
            fields: ['is_active']
        }
    ]
});

// Instance methods
Supplier.prototype.toJSON = function () {
    const values = { ...this.get() };
    return values;
};

// Class methods
Supplier.findByEmail = async function (email) {
    return await this.findOne({ where: { email } });
};

Supplier.findActive = async function () {
    return await this.findAll({
        where: { is_active: true },
        order: [['company_name', 'ASC']]
    });
};

module.exports = Supplier;

