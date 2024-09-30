const registerRouter = require('./routes/index.js');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors'); // Import cors here
const { setErrorResponse, setRouteResponse } = require('./controllers/errorHandlers.js');
require('dotenv').config();
 

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// setup routes
registerRouter(app);
module.exports = app;
