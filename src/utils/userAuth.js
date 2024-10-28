// src/middlewares/userAuth.js
const { logger, logApiCall } = require('../utils/logger'); // Import your logger and metrics functions

const userAuth = (req, res, next) => {
    const startTime = Date.now(); // Start timing the authentication process

    if (!req || !req.headers) {
        logger.warn(`Authentication Error: No request or headers for ${req.method} ${req.originalUrl}`);
        const duration = Date.now() - startTime; // Calculate duration
        logApiCall('userAuth.noRequestOrHeaders', duration); // Log metric
        return res.status(400).send(); // Bad Request
    }

    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Basic ')) {
        logger.warn(`Authentication Error: Missing or invalid authorization header for ${req.method} ${req.originalUrl}`);
        const duration = Date.now() - startTime; // Calculate duration
        logApiCall('userAuth.missingOrInvalidHeader', duration); // Log metric
        return res.status(401).send(); // Unauthorized
    }

    const token = authHeader.split(' ')[1];
    const credentials = Buffer.from(token, 'base64').toString('utf-8').split(':');

    if (credentials.length !== 2) {
        logger.warn(`Authentication Error: Invalid token format for ${req.method} ${req.originalUrl}`);
        const duration = Date.now() - startTime; // Calculate duration
        logApiCall('userAuth.invalidTokenFormat', duration); // Log metric
        return res.status(401).json(); // Unauthorized
    }

    const email = credentials[0];
    const password = credentials[1];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        logger.warn(`Authentication Error: Invalid email format for ${req.method} ${req.originalUrl}`);
        const duration = Date.now() - startTime; // Calculate duration
        logApiCall('userAuth.invalidEmailFormat', duration); // Log metric
        return res.status(401).send(); // Unauthorized
    }

    req.auth = { email, password };
    const duration = Date.now() - startTime; // Calculate duration for successful auth
    logApiCall('userAuth.success', duration); // Log metric for successful authentication
    next(); // Proceed to the next middleware
};

module.exports = userAuth;
