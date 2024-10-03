// src/middlewares/checkConnection.js
const sequelize = require('../config/dbConfig');
require('dotenv').config();

const checkConnection = async (req, res, next) => {
  try {
    await sequelize.authenticate(); 
    await sequelize.sync(); 
    next(); 
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return res.status(503).json({ message: 'Service Unavailable' }); 
  }
};

module.exports = checkConnection; 
