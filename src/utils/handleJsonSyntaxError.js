// src/middlewares/handleJsonSyntaxError.js

const { logger, logApiCall } = require('../utils/logger'); // Import your logger and metrics functions

const handleJsonSyntaxError = (err, req, res, next) => {
    const startTime = Date.now(); // Start timing the error handling process

    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        logger.warn(`JSON Syntax Error: ${err.message} for ${req.method} ${req.originalUrl}`); // Log warning
        const duration = Date.now() - startTime; // Calculate duration
        logApiCall('jsonSyntaxError', duration); // Log error handling metric
        return res.status(400).send(); // Respond with 400 Bad Request
    }

    next(); // Pass to the next middleware if not a syntax error
};

module.exports = handleJsonSyntaxError;
