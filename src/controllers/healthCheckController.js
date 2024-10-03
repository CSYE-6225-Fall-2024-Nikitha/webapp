const { setResponse, setErrorResponse } = require('./errorHandlers'); 
const { checkDatabaseConnection, validateRequest } = require('../services/healthCheckService'); 

const healthCheck = async (req, res) => {
    try {
        validateRequest(req); 
        await checkDatabaseConnection(); 
        setResponse(req, res); 
    } catch (error) {
        console.error('Error during health check:', error.message);
        setErrorResponse(req,res);
    }
};

module.exports = { healthCheck };
