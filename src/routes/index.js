const express = require('express');
const healthCheckRoute = require('./healthRoutes.js');
const userRoute = require('./userRoutes.js');
const { logger, logApiCall } = require('./logger'); // Assuming you have a logger setup

const registerRouter = (app) => {
    app.use('/healthz', (req, res, next) => {
        const startTime = Date.now();
        logger.info(`Incoming request to /healthz: ${req.method}`);
        next();
        const duration = Date.now() - startTime;
        logApiCall('healthz', duration);
    }, healthCheckRoute); 

    app.use('/v1/user', (req, res, next) => {
        const startTime = Date.now();
        logger.info(`Incoming request to /v1/user: ${req.method}`);
        next();
        const duration = Date.now() - startTime;
        logApiCall('user', duration);
    }, userRoute);
};

module.exports = registerRouter;
