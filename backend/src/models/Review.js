const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Review = sequelize.define('Review', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Đơn hàng mà sản phẩm được mua'
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
    },
    comment: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    images: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Mảng URLs ảnh review'
    },
    is_verified_purchase: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    helpful_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending'
    },
    admin_reply: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    admin_reply_date: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'reviews',
    timestamps: true,
    underscored: true,
    indexes: [
        { fields: ['product_id'] },
        { fields: ['user_id'] },
        { fields: ['rating'] },
        { fields: ['status'] },
        { fields: ['created_at'] }
    ]
});

module.exports = Review;


