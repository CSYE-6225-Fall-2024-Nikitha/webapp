const { setResponse, setErrorResponse } = require('./errorHandlers'); 
const { checkDatabaseConnection, validateRequest } = require('../services/healthCheckService'); 
const { logger, logApiCall } = require('../utils/logger');

const healthCheck = async (req, res) => {
    const startTime = Date.now();
    const apiName = req.originalUrl;

    try {
        validateRequest(req); 
        await checkDatabaseConnection(); 
        setResponse(req, res); 
        const duration = Date.now() - startTime; 
        logApiCall(apiName, duration);
    } catch (error) {
        logger.error('Error during health check: ' + error.message);
        if (error.message === 'Bad Request') {
            return res.status(400).send();
        }
        setErrorResponse(req, res);
    }
};

module.exports = { healthCheck };
