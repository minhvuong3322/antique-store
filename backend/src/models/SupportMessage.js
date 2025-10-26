const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SupportMessage = sequelize.define('SupportMessage', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    },
    // For guest users
    guest_name: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    guest_email: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    guest_phone: {
        type: DataTypes.STRING(20),
        allowNull: true
    },
    subject: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'in_progress', 'resolved', 'closed'),
        defaultValue: 'pending'
    },
    priority: {
        type: DataTypes.ENUM('low', 'normal', 'high', 'urgent'),
        defaultValue: 'normal'
    },
    admin_response: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    responded_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    responded_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'SET NULL'
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'support_messages',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = SupportMessage;

