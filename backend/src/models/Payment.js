const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Payment = sequelize.define('Payment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: 'orders',
            key: 'id'
        }
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: 'Số tiền phải lớn hơn 0'
            }
        }
    },
    payment_method: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            isIn: {
                args: [['COD', 'VNPay', 'Momo', 'PayPal', 'BankTransfer', 'QRCode']],
                msg: 'Phương thức thanh toán không hợp lệ'
            }
        }
    },
    payment_status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
        defaultValue: 'pending'
    },
    transaction_id: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    paid_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'payments',
    timestamps: true
});

// Mark payment as completed
Payment.prototype.markAsCompleted = async function () {
    this.payment_status = 'completed';
    this.paid_at = new Date();
    await this.save();
};

module.exports = Payment;



