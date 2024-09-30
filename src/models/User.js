const {DataTypes} = require('sequelize');
const {sequelize} = require('../config/dbConfig');

const User = sequelize.define('User', {
  id: {
    types: DataTypes.UUID,
    allowNull: false,
    unique:true,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },

  username:{
    types:DataTypes.STRING,
    allowNull: false,
    unique:true,
  },

  password: {
    types:DataTypes.STRING,
    allowNull: false,
    unique:false,
  },

  first_name:{
    types:DataTypes.STRING,
    allowNull: false,
    unique:false,
  },

  last_name:{
    types:DataTypes.STRING,
    allowNull: false,
    unique:false,
  },

  account_created: {
    types:DataTypes.DATE,
    allowNull: false,
    unique: false,
    defaultValue: DataTypes.NOW,
  },

  account_updated: {
    types:DataTypes.DATE,
    allowNull: true,
    unique: false,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW,
  }

});

module.exports = User;
