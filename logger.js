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
  level: 'debug',
  format: combine(timestamp(), json()),
  transports: [
    new winston.transports.File({
      filename: '/home/ubuntu/webapp/logs/webapp.log',
    }),
  ],
});

// Log API call metrics
function logApiCall(apiName, duration) {
  statsd.increment(`api.calls.${apiName}`); 
  statsd.timing(`api.timing.${apiName}`, duration);
}

// Log database query metrics
function logDbQuery(duration) {
  statsd.timing('db.query.timing', duration);
}

// Log S3 service call metrics
function logS3Call(duration) {
  statsd.timing('s3.call.timing', duration);
}

module.exports = { logger, logApiCall, logDbQuery, logS3Call };
