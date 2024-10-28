// src/middlewares/checkConnection.js
const sequelize = require('../config/dbConfig');
const { logger, logApiCall, logDbQuery } = require('../utils/logger'); // Import your logger functions

const checkConnection = async (req, res, next) => {
    const startTime = Date.now(); // Start timer for connection check
    try {
        await sequelize.authenticate(); 
        const connectionDuration = Date.now() - startTime; // Calculate duration for the connection check
        logger.info('Database connection established successfully.');
        
        logDbQuery(connectionDuration); // Log the duration of the database connection as a query metric
        next(); 
    } catch (error) {
        logger.error('Unable to connect to the database:', error); // Log the error
        const duration = Date.now() - startTime; // Calculate duration for the connection check failure
        logDbQuery(duration); // Log the failed connection duration as a query metric
        return res.status(503).json({ message: 'Service Unavailable' }); 
    }
};

module.exports = checkConnection;
