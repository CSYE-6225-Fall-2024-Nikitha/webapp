const { logApiCall, logger } = require('../utils/logger');

const setErrorResponse = (err, response) => {
  logger.error(err.message);
  response.status(503).send();
};

const setRouteResponse = (request, response, next) => {
  const apiName = request.path;
  const startTime = Date.now();

  if (request.path === '/healthz') {
    return next();
  }

  const duration = Date.now() - startTime; 
  logApiCall(apiName, duration);
  response.status(404).send();
};

const setResponse = (request, response) => {
  const apiName = request.path;
  const startTime = Date.now();

  if (request.method === 'GET') {
    if (request.headers['content-length'] > 0 || (request.body && Object.keys(request.body).length > 0)) {
      return response.status(400).send();
    }
    response.set('Cache-Control', 'no-cache');
    response.status(200).send();

    const duration = Date.now() - startTime; 
    logApiCall(apiName, duration);
  } else {
    logger.warn(`Method not allowed for ${apiName}`);
    return response.status(405).send();
  }
};

module.exports = {
  setErrorResponse,
  setRouteResponse,
  setResponse,
};
