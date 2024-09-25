const pool = require('../config/dbConfig');

const healthCheck = async (req, res) => {
    if (Object.keys(req.query).length > 0) {
        return res.status(400).send(); 
    }

    if (req.headers['content-length'] > 0) {
        return res.status(400).send(); 
    }

    try {
        // Check database connection
        await pool.query('SELECT NOW()');
        res.set('Cache-Control', 'no-cache');
        return res.status(200).send(); 
    } catch (error) {
        console.error('Database connection error:', error);
        res.set('Cache-Control', 'no-cache');
        return res.status(503).send(); 
    }
};

module.exports = { healthCheck };
