const express = require('express');
const router = express.Router();
const { healthCheck } = require('../controllers/healthCheckController');

router.head('/healthz', (req, res) => {
    res.set('Cache-Control', 'no-cache');
    return res.status(405).send(); // Method Not Allowed
});

// Health check endpoint
router.get('/healthz', healthCheck);

// Method Not Allowed for other methods
router.all('/healthz', (req, res) => {
    res.set('Cache-Control', 'no-cache');
    return res.status(405).send(); 
});

module.exports = router;
