const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig'); 

const Image = sequelize.define('Image', {
  file_name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'image.jpg',
  },
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  upload_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
}, {
  timestamps: false,
  tableName: 'Images',
  defaultScope: {
    attributes: { exclude: [] },
  },
});

Image.beforeUpdate((instance, options) => {
  delete instance.dataValues.id;
  delete instance.dataValues.file_name;
  delete instance.dataValues.url;
  delete instance.dataValues.upload_date;
  delete instance.dataValues.user_id;
});

module.exports = Image;
