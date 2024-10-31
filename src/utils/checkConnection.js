const sequelize = require('../config/dbConfig');
const { logger, logApiCall, logDbQuery } = require('../utils/logger'); 

const checkConnection = async (req, res, next) => {
    const startTime = Date.now(); 
    try {
        await sequelize.authenticate(); 
        const connectionDuration = Date.now() - startTime;
        logger.info('Database connection established successfully.');
        
        logDbQuery(connectionDuration); 
        next(); 
    } catch (error) {
        logger.error('Unable to connect to the database:', error); 
        const duration = Date.now() - startTime; 
        logDbQuery(duration); 
        return res.status(503).json({ message: 'Service Unavailable' }); 
    }
};

module.exports = checkConnection;
