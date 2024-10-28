const app = require('./app');
const sequelize = require('./config/dbConfig');
const { logger, logDbQuery } = require('./utils/logger'); // Import your logger and metrics functions
require('dotenv').config();

const startConnection = async () => {
  const startTime = Date.now(); // Start timing the connection process
  try {
    await sequelize.authenticate();
    const durationAuthenticate = Date.now() - startTime; // Calculate duration for authentication
    logger.info('Database connected'); // Log successful connection
    logDbQuery('database.authenticate', durationAuthenticate); // Log metric for database authentication

    const syncStartTime = Date.now(); // Start timing for syncing
    await sequelize.sync();
    const durationSync = Date.now() - syncStartTime; // Calculate dur
