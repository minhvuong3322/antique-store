const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const SocialAuth = sequelize.define('SocialAuth', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    },
    provider: {
        type: DataTypes.ENUM('google', 'facebook', 'apple', 'github'),
        allowNull: false
    },
    provider_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true
    },
    profile_data: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Dữ liệu profile từ OAuth provider'
    },
    access_token: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    refresh_token: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: true
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
    tableName: 'social_auths',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            unique: true,
            fields: ['provider', 'provider_id'],
            name: 'social_auths_provider_provider_id'
        },
        {
            unique: true,
            fields: ['user_id', 'provider'],
            name: 'social_auths_user_id_provider'
        },
        {
            fields: ['user_id']
        }
    ]
});

module.exports = SocialAuth;


