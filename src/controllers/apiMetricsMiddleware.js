const { logApiCall } = require('../utils/logger');

const apiMetricsMiddleware = (req, res, next) => {
  const startTime = Date.now(); 

  res.on('finish', () => {
    const duration = Date.now() - startTime; 
    const apiName = req.originalUrl; 
    logApiCall(apiName, duration); 
  });

  next(); 
};

module.exports = apiMetricsMiddleware;
