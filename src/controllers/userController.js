const userService = require('../services/userService');
const { validateRequest } = require('../services/healthCheckService');
const { logger, logApiCall } = require('../utils/logger');

const validateUserFields = (data) => {
    const { first_name, last_name, password, email } = data;
    const errors = [];

    if (!first_name || first_name.trim() === '') {
        errors.push('first_name: Should not be empty.');
    }
    if (!last_name || last_name.trim() === '') {
        errors.push('last_name: Should not be empty.');
    }
    if (!password || password.length < 6) {
        errors.push('password: Should have a minimum length of at least 6 characters.');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push('email: Should be a valid email format.');
    }

    return errors;
};

const createUser = async (req, res) => {
    const startTime = Date.now();
    const apiName = req.originalUrl;
    res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
    });

    const allowedFields = ['first_name', 'last_name', 'password', 'email'];
    
    const invalidFields = Object.keys(req.body).filter(field => !allowedFields.includes(field));
    if (invalidFields.length > 0) {
        logger.warn(`Invalid fields in request: ${invalidFields.join(', ')}`);
        logApiCall(apiName, Date.now() - startTime);
        return res.status(400).send();
    }

    try {
        const { first_name, last_name, password, email } = req.body;
        const validationErrors = validateUserFields({ first_name, last_name, password, email });
        if (validationErrors.length > 0) {
            logger.warn(`Validation errors: ${validationErrors.join(', ')}`);
            logApiCall(apiName, Date.now() - startTime);
            return res.status(400).send();
        }

        const user = await userService.createUser({ first_name, last_name, password, email });
        logger.info(`User created successfully: ${user.email}`);
        logApiCall(apiName, Date.now() - startTime);

        return res.status(201).json({
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            account_created: user.account_created,
            account_updated: user.account_updated
        });
    } catch (error) {
        logger.error(`Error creating user: ${error.message}`);
        if (['User already exists', 'Invalid email format', 'Bad Request'].includes(error.message) || error instanceof SyntaxError) {
            return res.status(400).send();
        }
        return res.status(400).send(); 
    }
};

const updateUser = async (req, res) => {
    const startTime = Date.now();
    const apiName = req.originalUrl;
    res.set('Cache-Control', 'no-cache');
    res.set('Content-Type', 'application/json');

    try {
        const { email, password } = req.auth;
        const user = await userService.authenticateUser(email, password);
        if (!user) {
            logger.warn('Authentication failed: Invalid credentials.');
            logApiCall(apiName, Date.now() - startTime);
            return res.status(401).send(); 
        }

        const allowedFields = ['first_name', 'last_name', 'password'];
        const requiredFields = ['first_name', 'last_name', 'password', 'email'];

        if (req.headers['content-type'] !== 'application/json') {
            logger.warn('Invalid Content-Type header: Expected application/json');
            logApiCall(apiName, Date.now() - startTime);
            return res.status(400).send(); 
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            logger.warn('Request body is missing for update.');
            logApiCall(apiName, Date.now() - startTime);
            return res.status(400).send(); 
        }

        const userId = user.id; 
        const updateData = req.body;
        const { first_name, last_name, password: newPassword } = updateData;

        if (updateData.email && updateData.email !== email) {
            logger.warn('Attempt to change email in update request.');
            logApiCall(apiName, Date.now() - startTime);
            return res.status(400).send();
        }

        const missingFields = requiredFields.filter(field => !updateData[field]);
        if (missingFields.length > 0) {
            logger.warn(`Missing fields for update: ${missingFields.join(', ')}`);
            logApiCall(apiName, Date.now() - startTime);
            return res.status(400).send(); 
        }

        const invalidFields = Object.keys(updateData).filter(key => !allowedFields.includes(key) && key !== 'email');
        if (invalidFields.length > 0) {
            logger.warn(`Invalid fields in update request: ${invalidFields.join(', ')}`);
            logApiCall(apiName, Date.now() - startTime);
            return res.status(400).send(); 
        }

        const validationError = validateUserFields({ first_name, last_name, password: newPassword, email });
        if (validationError.length > 0) {
            logger.warn(`Validation errors on update: ${validationError.join(', ')}`);
            logApiCall(apiName, Date.now() - startTime);
            return res.status(400).json({ errors: validationError }); 
        }

        if (updateData.email) {
            delete updateData.email; 
        }

        await userService.updateUser(userId, updateData);
        logger.info(`User updated successfully: ${userId}`);
        logApiCall(apiName, Date.now() - startTime);

        return res.status(204).send(); 

    } catch (error) {
        logger.error(`Error updating user: ${error.message}`);
        if (error.message === 'Invalid credentials' || error.message === 'User not found') {
            logApiCall(apiName, Date.now() - startTime);
            return res.status(401).send(); 
        } else if (error.message === 'Body is missing to update' || error.message === 'Bad Request') {
            logApiCall(apiName, Date.now() - startTime);
            return res.status(400).send(); 
        } else if (error.message === 'Forbidden user') {
            logApiCall(apiName, Date.now() - startTime);
            return res.status(400).send(); 
        } else if (error instanceof SyntaxError) {
            logApiCall(apiName, Date.now() - startTime);
            return res.status(400).send();
        }
        logApiCall(apiName, Date.now() - startTime);
        return res.status(400).send(); 
    }
};

const getUser = async (req, res) => {
    const startTime = Date.now();
    const apiName = req.originalUrl;
    res.set('Cache-Control', 'no-cache');
    res.set('Content-Type', 'application/json');

    try {
        const { email, password } = req.auth;
        const user = await userService.authenticateUser(email, password);
        validateRequest(req);
        
        if (!user) {
            logger.warn('Authentication failed: Invalid credentials.');
            logApiCall(apiName, Date.now() - startTime);
            return res.status(401).send(); 
        }
        const userId = user.id; 
        const userInfo = await userService.getUser(userId);
        logger.info(`User retrieved successfully: ${userId}`);
        logApiCall(apiName, Date.now() - startTime);

        return res.status(200).json(userInfo); 

    } catch (error) {
        logger.error(`Error retrieving user: ${error.message}`);
        if (error.message === 'Invalid credentials' || error.message === 'User not found') {
            logApiCall(apiName, Date.now() - startTime);
            return res.status(401).send(); 
        } else if (error.message === 'Bad Request' || error instanceof SyntaxError) {
            logApiCall(apiName, Date.now() - startTime);
            return res.status(400).send(); 
        }
        logApiCall(apiName, Date.now() - startTime);
        return res.status(400).send(); 
    }
};

module.exports = {
    createUser,
    updateUser,
    getUser,
};
