const sequelize = require('../config/dbConfig'); 
const { setResponse, setErrorResponse } = require('../middlewares/errorHandlers'); 

const healthCheck = async (req, res) => {
    try {
        if (Object.keys(req.query).length > 0) {
            return res.status(400).send(); 
        }

        if (req.body && (typeof req.body !== 'object' || Array.isArray(req.body))) {
            return res.status(400).send(); 
        }

        if (req.headers['content-length'] > 0 && !req.body) {
            return res.status(400).send(); 
        }
        await sequelize.authenticate();
        setResponse(req, res); 
    } catch (error) {
        console.error('Database connection error:', error);
        setErrorResponse(error, res);
    }
};

module.exports = { healthCheck };
