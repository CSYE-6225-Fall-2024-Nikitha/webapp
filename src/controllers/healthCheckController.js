const sequelize = require('../config/dbConfig'); 
const { setResponse, setErrorResponse } = require('../middlewares/errorHandlers'); 

const healthCheck = async (req, res) => {
    try {
        res.set('Cache-Control', 'no-cache');
        console.log('Checking headers', req.headers);
        if ((parseInt(req.get('Content-Length')) || 0) > 0 
        || Object.keys(req.query).length > 0 
        ||Object.keys(req.body).length > 0 ||
        Object.keys(req.params).length > 0 ||
        (req.headers.cookie && req.headers.cookie.length > 0)
         ) {
            return res.status(400).send(); 
        }

        if (req.body && (typeof req.body !== 'object' || Array.isArray(req.body))) {
            return res.status(400).send(); 
        }

        if (req.headers['content-length'] > 0 ) {
            console.log('Content-Length: ' + req.headers['content-length']);
            if (!req.body || (typeof req.body !== 'object' || Array.isArray(req.body))) {
                return res.status(400).send(); 
            }
        }

        await sequelize.authenticate();
        setResponse(req, res); 
    } catch (error) {
        console.error('Database connection error:', error);
        setErrorResponse(error, res);
    }
};

module.exports = { healthCheck };
