const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const User = require('./User'); 

const EmailTrack = sequelize.define('EmailTrack', {
    email_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        unique: true
    },

    verification_token: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    verification_link: {
        type: DataTypes.STRING,
        allowNull: true
    },

    expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },

    is_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },

    errorMessage: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    sent_date: {
        type: DataTypes.DATE,
        allowNull: true
    },

    sns_message_id: {
        type: DataTypes.STRING,
        allowNull: true
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,  
            key: 'id',   
        },
        onDelete: 'CASCADE',  
    }
}, {
    timestamps: true,
});

EmailTrack.belongsTo(User, { foreignKey: 'userId' });

module.exports = EmailTrack;
