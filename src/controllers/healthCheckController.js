const sequelize = require('../config/dbConfig'); 
const { setResponse, setErrorResponse } = require('../middlewares/errorHandlers'); 

const healthCheck = async (req, res) => {
    if (Object.keys(req.query).length > 0 || req.headers['content-length'] > 0 || (req.body && Object.keys(req.body).length > 0)) {
        return setResponse(req, res); 
    }

    try {
        await sequelize.authenticate();
        setResponse(req, res); 
    } catch (error) {
        console.error('Database connection error:', error);
        setErrorResponse(error, res);
    }
};

module.exports = { healthCheck };
