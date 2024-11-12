const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  password: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },

  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },

  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: false,
  },

  account_created: {
    type: DataTypes.DATE,
    allowNull: false,
    unique: false,
    defaultValue: DataTypes.NOW,
  },

  account_updated: {
    type: DataTypes.DATE,
    allowNull: true,
    unique: false,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW,
  },

  email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },

  verification_sent_time: {
    type: DataTypes.DATE,
    allowNull: true,
  },

  token: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: true,
    unique: true,
  },

  verification_token_expiry: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  indexes: [
    { unique: true, fields: ['email'] },
  ],
});

User.sync();

module.exports = User;
