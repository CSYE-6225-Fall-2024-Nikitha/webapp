const registerRouter = require('./routes/index.js');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const handleJsonSyntaxError = require('./utils/handleJsonSyntaxError.js');
const { apiMetricsMiddleware } = require('./controllers/apiMetricsMiddleware');
require('dotenv').config();
 

const app = express();
// app.use(cors());
app.use(express.json());
app.use(handleJsonSyntaxError);
app.use(apiMetricsMiddleware);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// setup routes
registerRouter(app);
module.exports = app;
