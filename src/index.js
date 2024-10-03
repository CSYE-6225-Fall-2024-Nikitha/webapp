const app = require('./app'); 
const sequelize = require('./config/dbConfig'); 
require('dotenv').config();

const startConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    await sequelize.sync(); 
    console.log('Database synced');

    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startConnection();
