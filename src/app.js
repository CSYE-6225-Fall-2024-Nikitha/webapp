const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { setErrorResponse, setRouteResponse } = require('./middlewares/errorHandlers');
const registerRouter = require('./routes/index.js');
require('dotenv').config();
 

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/', healthRoutes);
app.use(bodyParser.urlencoded({ extended: true }));

// setup routes
registerRouter(app);


app.use((err, req, res, next) => {
    return res.status(400).send(); 
});
module.exports = app;
