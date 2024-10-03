const express = require('express');
const router = express.Router();
const { healthCheck } = require('../controllers/healthCheckController');

router.head('/', (req, res) => {
    res.set('Cache-Control', 'no-cache');
    return res.status(405).send(); // Method Not Allowed
});

// Health check endpoint
router.get('/', healthCheck);

// Method Not Allowed for other methods
router.all('/', (req, res) => {
    res.set('Cache-Control', 'no-cache');
    return res.status(405).send(); 
});

module.exports = router;
