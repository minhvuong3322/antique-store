const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Voucher = sequelize.define('Voucher', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    code: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
        comment: 'Mã voucher'
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    discount_type: {
        type: DataTypes.ENUM('percentage', 'fixed_amount'),
        defaultValue: 'percentage'
    },
    discount_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    max_discount_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Giảm tối đa cho type=percentage'
    },
    min_order_amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    applicable_products: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Mảng IDs sản phẩm'
    },
    applicable_categories: {
        type: DataTypes.JSON,
        allowNull: true
    },
    usage_limit: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'null = unlimited'
    },
    usage_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    usage_limit_per_user: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'vouchers',
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ['code'] },
        { fields: ['is_active'] },
        { fields: ['start_date', 'end_date'] }
    ]
});

module.exports = Voucher;


