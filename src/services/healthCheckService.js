const sequelize = require('../config/dbConfig'); 

const checkDatabaseConnection = async () => {
    try {
        await sequelize.authenticate();
        return { success: true };
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }
};

const validateRequest = (req) => {
    if ((parseInt(req.get('Content-Length')) || 0) > 0 
        || Object.keys(req.query).length > 0 
        || Object.keys(req.body).length > 0 ||
        Object.keys(req.params).length > 0 ||
        (req.headers.cookie && req.headers.cookie.length > 0)) {
        throw new Error('Bad Request');
    }

    if (req.body && (typeof req.body !== 'object' || Array.isArray(req.body))) {
        throw new Error('Bad Request');
    }

    if (req.headers['content-length'] > 0) {
        if (!req.body || (typeof req.body !== 'object' || Array.isArray(req.body))) {
            throw new Error('Bad Request');
        }
    }
};

module.exports = { checkDatabaseConnection, validateRequest };
