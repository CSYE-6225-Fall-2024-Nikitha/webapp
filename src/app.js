const express = require('express');
const bodyParser = require('body-parser');
const healthRoutes = require('./routes/healthRoutes');
const { setErrorResponse, setRouteResponse } = require('./middlewares/errorHandlers');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(bodyParser.json({ limit: '1mb' }));

app.use('/', healthRoutes);

app.use(setRouteResponse);

app.use((err, req, res, next) => {
    return res.status(400).send(); 
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
