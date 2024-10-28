const express = require('express');
const { createUser, updateUser, getUser } = require('../controllers/userController'); 
const userAuth = require('../utils/userAuth');
const checkConnection = require('../utils/checkConnection');
const { logger, logApiCall } = require('./logger'); // Import logger and metrics function

const router = express.Router();

router.head('/self', (req, res) => {
    res.status(405).end();
});

router.head('/', (req, res) => {
    res.status(405).end();
});

// Create User
router.post('/', checkConnection, async (req, res) => {
    const startTime = Date.now();
    try {
        await createUser(req, res);
    } catch (error) {
        logger.error(`Error creating user: ${error.message}`);
        return res.status(500).send(); // Internal Server Error, if needed
    } finally {
        const duration = Date.now() - startTime;
        logger.info(`POST request to create user took ${duration}ms`);
        logApiCall('create_user', duration); // Log API call metrics
    }
});

// Get User
router.get('/self', checkConnection, userAuth, async (req, res) => {
    const startTime = Date.now();
    try {
        await getUser(req, res);
    } catch (error) {
        logger.error(`Error retrieving user: ${error.message}`);
        return res.status(500).send(); // Internal Server Error, if needed
    } finally {
        const duration = Date.now() - startTime;
        logger.info(`GET request to retrieve user took ${duration}ms`);
        logApiCall('get_user', duration); // Log API call metrics
    }
});

// Update User
router.put('/self', checkConnection, userAuth, async (req, res) => {
    const startTime = Date.now();
    try {
        await updateUser(req, res);
    } catch (error) {
        logger.error(`Error updating user: ${error.message}`);
        return res.status(500).send(); // Internal Server Error, if needed
    } finally {
        const duration = Date.now() - startTime;
        logger.info(`PUT request to update user took ${duration}ms`);
        logApiCall('update_user', duration); // Log API call metrics
    }
});

// Method Not Allowed for other methods
router.all('/self', (req, res) => {
    res.status(405).send(); 
});

router.all('/', (req, res) => {
    res.status(405).send(); 
});

// Handle 404 errors
router.all('*', (req, res) => {
    res.status(404).send(); 
});

module.exports = router;
