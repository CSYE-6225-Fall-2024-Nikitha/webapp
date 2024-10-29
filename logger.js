const winston = require('winston');
const { combine, timestamp, json } = winston.format;
const StatsD = require('hot-shots');

// Initialize StatsD client
const statsd = new StatsD({
  host: '127.0.0.1',
  port: 8125,
  prefix: 'webapp.',
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: '/home/ubuntu/webapp/logs/webapp.log',
    }),
  ],
});

// Log API call metrics
function logApiCall(req, res, apiName, duration) {
  const { method, url } = req;
  logger.info({
    message: `API call ${method} ${url}`,
    duration,
    status: res.statusCode,
  });

  try {
    statsd.increment(`api.calls.${apiName}`);
    statsd.timing(`api.timing.${apiName}`, duration);
  } catch (error) {
    logger.error(`StatsD error: ${error.message}`);
  }
}

// Log database query metrics
function logDbQuery(duration) {
  try {
    statsd.timing('db.query.timing', duration);
  } catch (error) {
    logger.error(`StatsD error: ${error.message}`);
  }
}

// Log S3 service call metrics
function logS3Call(duration) {
  try {
    statsd.timing('s3.call.timing', duration);
  } catch (error) {
    logger.error(`StatsD error: ${error.message}`);
  }
}

module.exports = { logger, logApiCall, logDbQuery, logS3Call };
