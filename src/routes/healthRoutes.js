const express = require('express');
const router = express.Router();
const { healthCheck } = require('../controllers/healthCheckController');

// Health check endpoint
router.get('/healthz', healthCheck);

router.all('/healthz', (req, res) => {
    res.set('Cache-Control', 'no-cache');
    return res.status(405).send(); // Method Not Allowed, no body in the response
});

module.exports = router;
