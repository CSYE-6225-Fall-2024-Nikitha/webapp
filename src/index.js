const app = require('./app');
const sequelize = require('./config/dbConfig');
const { logger, logDbQuery } = require('./utils/logger'); // Import your logger and metrics functions
require('dotenv').config();

const startConnection = async () => {
  const startTime = Date.now(); // Start timing the connection process
  try {
    await sequelize.authenticate(); // Attempt to connect to the database
    const durationAuthenticate = Date.now() - startTime; // Calculate duration for authentication
    logger.info('Database connected successfully.'); // Log successful connection
    logDbQuery('database.authenticate', durationAuthenticate); // Log metric for database authentication

    const syncStartTime = Date.now(); // Start timing for syncing
    await sequelize.sync(); // Synchronize the database
    const durationSync = Date.now() - syncStartTime; // Calculate duration for sync
    logger.info('Database synced successfully.'); // Log successful sync
    logDbQuery('database.sync', durationSync); // Log metric for database sync

    const PORT = process.env.PORT || 8080; // Define the port
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}.`); // Log server start
    });
  } catch (error) {
    logger.error('Unable to connect to the database:', error); // Log connection error
  }
};

startConnection();
