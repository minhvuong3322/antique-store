const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Invoice = sequelize.define('Invoice', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: {
            msg: 'Đơn hàng này đã có hóa đơn'
        }
    },
    invoice_number: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: {
            msg: 'Số hóa đơn đã tồn tại'
        },
        comment: 'Số hóa đơn'
    },
    invoice_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    // Thông tin khách hàng
    customer_name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    customer_email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            isEmail: {
                msg: 'Email không hợp lệ'
            }
        }
    },
    customer_phone: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    customer_address: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    customer_tax_code: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: 'Mã số thuế (nếu là doanh nghiệp)'
    },
    // Thông tin tài chính
    subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Tổng tiền hàng'
    },
    tax: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
        comment: 'Thuế VAT'
    },
    shipping_fee: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    discount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        comment: 'Tổng cộng'
    },
    // Metadata
    payment_method: {
        type: DataTypes.STRING(50),
        allowNull: true
    },
    payment_status: {
        type: DataTypes.ENUM('unpaid', 'paid', 'partially_paid', 'refunded'),
        defaultValue: 'unpaid'
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    pdf_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
        comment: 'Link file PDF hóa đơn'
    },
    sent_to_email: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Đã gửi email hay chưa'
    },
    sent_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Admin tạo hóa đơn'
    }
}, {
    tableName: 'invoices',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['order_id']
        },
        {
            unique: true,
            fields: ['invoice_number']
        },
        {
            unique: false,
            fields: ['invoice_date']
        },
        {
            unique: false,
            fields: ['customer_email']
        }
    ]
});

// Instance methods
Invoice.prototype.toJSON = function () {
    const values = { ...this.get() };
    return values;
};

Invoice.prototype.markAsSent = async function () {
    this.sent_to_email = true;
    this.sent_at = new Date();
    await this.save();
};

// Class methods
Invoice.findByNumber = async function (invoiceNumber) {
    return await this.findOne({
        where: { invoice_number: invoiceNumber },
        include: [
            {
                association: 'order',
                include: [
                    { association: 'user' },
                    {
                        association: 'order_details',
                        include: ['product']
                    }
                ]
            }
        ]
    });
};

Invoice.findByOrder = async function (orderId) {
    return await this.findOne({
        where: { order_id: orderId },
        include: [
            {
                association: 'order',
                include: [
                    { association: 'order_details', include: ['product'] }
                ]
            }
        ]
    });
};

Invoice.findByCustomer = async function (email) {
    return await this.findAll({
        where: { customer_email: email },
        order: [['invoice_date', 'DESC']],
        include: [{ association: 'order' }]
    });
};

Invoice.generateInvoiceNumber = function () {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const timestamp = Date.now();
    const sequence = String(timestamp).slice(-4); // Last 4 digits

    return `INV-${year}${month}${day}-${sequence}`;
};

Invoice.getPendingInvoices = async function () {
    return await this.findAll({
        where: { payment_status: 'unpaid' },
        order: [['invoice_date', 'DESC']],
        include: [{ association: 'order', include: ['user'] }]
    });
};

module.exports = Invoice;

