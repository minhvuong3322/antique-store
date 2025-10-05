const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const slugify = require('slugify');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'categories',
            key: 'id'
        }
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Tên sản phẩm không được để trống'
            }
        }
    },
    slug: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: {
            msg: 'Slug đã tồn tại'
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            min: {
                args: [0],
                msg: 'Giá phải lớn hơn hoặc bằng 0'
            }
        }
    },
    sale_price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
        validate: {
            min: {
                args: [0],
                msg: 'Giá khuyến mãi phải lớn hơn hoặc bằng 0'
            }
        }
    },
    stock_quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: {
                args: [0],
                msg: 'Số lượng tồn kho phải lớn hơn hoặc bằng 0'
            }
        }
    },
    sku: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: true
    },
    images: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    condition: {
        type: DataTypes.ENUM('excellent', 'good', 'fair', 'poor'),
        allowNull: true
    },
    origin: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    year_manufactured: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    material: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    dimensions: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    weight: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: true
    },
    is_featured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    view_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    tableName: 'products',
    timestamps: true,
    hooks: {
        beforeValidate: (product) => {
            if (product.name && !product.slug) {
                product.slug = slugify(product.name, {
                    lower: true,
                    strict: true,
                    locale: 'vi'
                });
            }
        }
    }
});

// Instance method to get effective price
Product.prototype.getEffectivePrice = function () {
    return this.sale_price || this.price;
};

// Instance method to check if in stock
Product.prototype.isInStock = function (quantity = 1) {
    return this.stock_quantity >= quantity;
};

module.exports = Product;



