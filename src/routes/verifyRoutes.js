const express = require('express');
const { verifyEmail } = require('../controllers/userController'); 
const checkConnection = require('../utils/checkConnection');
const { apiMetricsMiddleware } = require('../controllers/apiMetricsMiddleware'); 


const router = express.Router();


router.use(apiMetricsMiddleware);

router.head('/', (req, res) => {
    res.status(405).end();
});


router.get('/', checkConnection, verifyEmail);

router.all('/', (req, res) => {
  res.status(405).send(); 
});


router.all('*', (req, res) => {
    res.status(404).send(); 
});

module.exports = router;