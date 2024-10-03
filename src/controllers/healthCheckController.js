const { setResponse, setErrorResponse } = require('./errorHandlers'); 
const { checkDatabaseConnection, validateRequest } = require('../services/healthCheckService'); 

const healthCheck = async (req, res) => {
    try {
        validateRequest(req); 
        await checkDatabaseConnection(); 
        setResponse(req, res); 
    } catch (error) {
        console.error('Error during health check:', error.message);
        if(error.message === 'Bad Request'){
            return res.status(400).send();
        }
        setErrorResponse(req,res);
    }
};

module.exports = { healthCheck };
