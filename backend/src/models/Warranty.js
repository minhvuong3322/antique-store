const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Warranty = sequelize.define('Warranty', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    warranty_code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: {
            msg: 'Mã bảo hành đã tồn tại'
        },
        comment: 'Mã bảo hành'
    },
    warranty_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Ngày bắt đầu bảo hành'
    },
    expiry_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: 'Ngày hết hạn bảo hành'
    },
    warranty_period: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: {
                args: [1],
                msg: 'Thời gian bảo hành phải ít nhất 1 tháng'
            }
        },
        comment: 'Thời gian bảo hành (tháng)'
    },
    issue_description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Mô tả vấn đề khi khách hàng yêu cầu bảo hành'
    },
    status: {
        type: DataTypes.ENUM('active', 'claimed', 'processing', 'completed', 'expired', 'cancelled'),
        defaultValue: 'active',
        allowNull: false
    },
    claimed_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Thời gian yêu cầu bảo hành'
    },
    completed_at: {
        type: DataTypes.DATE,
        allowNull: true,
        comment: 'Thời gian hoàn thành bảo hành'
    },
    admin_notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Ghi chú của admin'
    }
}, {
    tableName: 'warranties',
    timestamps: true,
    indexes: [
        {
            unique: false,
            fields: ['order_id']
        },
        {
            unique: false,
            fields: ['product_id']
        },
        {
            unique: true,
            fields: ['warranty_code']
        },
        {
            unique: false,
            fields: ['status']
        },
        {
            unique: false,
            fields: ['expiry_date']
        }
    ]
});

// Instance methods
Warranty.prototype.toJSON = function () {
    const values = { ...this.get() };
    return values;
};

Warranty.prototype.isExpired = function () {
    return new Date() > new Date(this.expiry_date);
};

Warranty.prototype.isActive = function () {
    return this.status === 'active' && !this.isExpired();
};

Warranty.prototype.canClaim = function () {
    return this.status === 'active' && !this.isExpired();
};

// Class methods
Warranty.findByCode = async function (warrantyCode) {
    return await this.findOne({
        where: { warranty_code: warrantyCode },
        include: [
            { association: 'order', include: ['user'] },
            { association: 'product' }
        ]
    });
};

Warranty.findByOrder = async function (orderId) {
    return await this.findAll({
        where: { order_id: orderId },
        include: [{ association: 'product' }],
        order: [['created_at', 'DESC']]
    });
};

Warranty.findByUser = async function (userId) {
    const Order = require('./Order');
    const orders = await Order.findAll({
        where: { user_id: userId },
        attributes: ['id']
    });

    const orderIds = orders.map(o => o.id);

    return await this.findAll({
        where: { order_id: orderIds },
        include: [
            { association: 'order' },
            { association: 'product' }
        ],
        order: [['created_at', 'DESC']]
    });
};

Warranty.findExpired = async function () {
    const { Op } = require('sequelize');
    return await this.findAll({
        where: {
            expiry_date: { [Op.lt]: new Date() },
            status: { [Op.notIn]: ['expired', 'cancelled'] }
        }
    });
};

Warranty.generateWarrantyCode = function (orderNumber, productId) {
    const timestamp = Date.now();
    return `WR-${orderNumber}-${productId}-${timestamp}`;
};

module.exports = Warranty;

