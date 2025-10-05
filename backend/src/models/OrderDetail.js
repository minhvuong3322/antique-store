const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OrderDetail = sequelize.define('OrderDetail', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'orders',
            key: 'id'
        }
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'products',
            key: 'id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: {
                args: [1],
                msg: 'Số lượng phải lớn hơn hoặc bằng 1'
            }
        }
    },
    unit_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    tableName: 'order_details',
    timestamps: true,
    updatedAt: false // OrderDetails don't need updatedAt
});

// Hook to calculate subtotal
OrderDetail.beforeValidate((orderDetail) => {
    if (orderDetail.quantity && orderDetail.unit_price) {
        orderDetail.subtotal = orderDetail.quantity * orderDetail.unit_price;
    }
});

module.exports = OrderDetail;



