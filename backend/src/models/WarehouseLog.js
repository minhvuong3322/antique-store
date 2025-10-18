const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const WarehouseLog = sequelize.define('WarehouseLog', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    supplier_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Chỉ có khi type = import'
    },
    type: {
        type: DataTypes.ENUM('import', 'export', 'adjustment'),
        allowNull: false,
        comment: 'Loại: nhập/xuất/điều chỉnh'
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notNull: {
                msg: 'Số lượng không được để trống'
            },
            isInt: {
                msg: 'Số lượng phải là số nguyên'
            }
        },
        comment: 'Số lượng thay đổi (dương = nhập, âm = xuất)'
    },
    quantity_before: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Tồn kho trước khi thay đổi'
    },
    quantity_after: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Tồn kho sau khi thay đổi'
    },
    unit_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Đơn giá nhập/xuất'
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        comment: 'Tổng giá trị'
    },
    reference_type: {
        type: DataTypes.ENUM('order', 'purchase', 'manual'),
        allowNull: true,
        comment: 'Tham chiếu: đơn hàng/mua hàng/thủ công'
    },
    reference_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'ID tham chiếu (order_id nếu reference_type = order)'
    },
    notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Ghi chú'
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'User thực hiện thao tác'
    }
}, {
    tableName: 'warehouse_logs',
    timestamps: true,
    updatedAt: false, // Không cần updatedAt cho log
    indexes: [
        {
            unique: false,
            fields: ['product_id']
        },
        {
            unique: false,
            fields: ['type']
        },
        {
            unique: false,
            fields: ['created_at']
        },
        {
            unique: false,
            fields: ['supplier_id']
        }
    ]
});

// Instance methods
WarehouseLog.prototype.toJSON = function () {
    const values = { ...this.get() };
    return values;
};

// Class methods
WarehouseLog.findByProduct = async function (productId, options = {}) {
    const where = { product_id: productId };

    if (options.type) {
        where.type = options.type;
    }

    return await this.findAll({
        where,
        order: [['created_at', 'DESC']],
        include: [
            { association: 'product' },
            { association: 'supplier' },
            { association: 'creator' }
        ],
        limit: options.limit || 100
    });
};

WarehouseLog.findBySupplier = async function (supplierId, options = {}) {
    return await this.findAll({
        where: { supplier_id: supplierId },
        order: [['created_at', 'DESC']],
        include: [
            { association: 'product' },
            { association: 'creator' }
        ],
        limit: options.limit || 100
    });
};

WarehouseLog.getInventorySummary = async function (productId) {
    const logs = await this.findAll({
        where: { product_id: productId },
        order: [['created_at', 'ASC']]
    });

    let totalImport = 0;
    let totalExport = 0;
    let totalAdjustment = 0;

    logs.forEach(log => {
        switch (log.type) {
            case 'import':
                totalImport += log.quantity;
                break;
            case 'export':
                totalExport += Math.abs(log.quantity);
                break;
            case 'adjustment':
                totalAdjustment += log.quantity;
                break;
        }
    });

    return {
        total_import: totalImport,
        total_export: totalExport,
        total_adjustment: totalAdjustment,
        current_stock: totalImport - totalExport + totalAdjustment,
        log_count: logs.length
    };
};

module.exports = WarehouseLog;

