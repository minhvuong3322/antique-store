const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ProductSupplier = sequelize.define('ProductSupplier', {
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
        allowNull: false
    },
    supply_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: 'Giá nhập phải lớn hơn 0'
            }
        },
        comment: 'Giá nhập từ nhà cung cấp'
    },
    is_primary: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Nhà cung cấp chính'
    }
}, {
    tableName: 'product_suppliers',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['product_id', 'supplier_id'],
            name: 'unique_product_supplier'
        },
        {
            unique: false,
            fields: ['product_id']
        },
        {
            unique: false,
            fields: ['supplier_id']
        }
    ]
});

// Instance methods
ProductSupplier.prototype.toJSON = function () {
    const values = { ...this.get() };
    return values;
};

// Class methods
ProductSupplier.findByProduct = async function (productId) {
    return await this.findAll({
        where: { product_id: productId },
        include: ['supplier']
    });
};

ProductSupplier.findBySupplier = async function (supplierId) {
    return await this.findAll({
        where: { supplier_id: supplierId },
        include: ['product']
    });
};

ProductSupplier.findPrimarySupplier = async function (productId) {
    return await this.findOne({
        where: {
            product_id: productId,
            is_primary: true
        },
        include: ['supplier']
    });
};

module.exports = ProductSupplier;

