const app = require('./app');
const sequelize = require('./config/dbConfig');
const { logger, logDbQuery } = require('./utils/logger'); 
require('dotenv').config();

const startConnection = async () => {
  const startTime = Date.now(); 
  try {
    await sequelize.authenticate(); 
    const durationAuthenticate = Date.now() - startTime; 
    logger.info('Database connected successfully.'); 
    logDbQuery('database.authenticate', durationAuthenticate); 

    const syncStartTime = Date.now(); 
    await sequelize.sync(); 
    const durationSync = Date.now() - syncStartTime; 
    logger.info('Database synced successfully.'); 
    logDbQuery('database.sync', durationSync); 

    const PORT = process.env.PORT || 8080; 
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}.`);
    });
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
  }
};

startConnection();
