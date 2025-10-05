const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const slugify = require('slugify');

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Tên danh mục không được để trống'
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
    image: {
        type: DataTypes.STRING(500),
        allowNull: true
    },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'categories',
            key: 'id'
        }
    }
}, {
    tableName: 'categories',
    timestamps: true,
    hooks: {
        beforeValidate: (category) => {
            if (category.name && !category.slug) {
                category.slug = slugify(category.name, {
                    lower: true,
                    strict: true,
                    locale: 'vi'
                });
            }
        }
    }
});

// Self-referencing association
Category.hasMany(Category, {
    as: 'children',
    foreignKey: 'parent_id'
});

Category.belongsTo(Category, {
    as: 'parent',
    foreignKey: 'parent_id'
});

module.exports = Category;



