const userService = require('../services/userService');
const userAuth = require('../utils/userAuth');
const { setErrorResponse } = require('./errorHandlers');
const { validateRequest } = require('../services/healthCheckService');

// Validation utility function
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
    res.set('Cache-Control', 'no-cache');
    res.set('Content-Type', 'application/json');

    const { first_name, last_name, password, email } = req.body;

    try {
        const validationErrors = validateUserFields({ first_name, last_name, password, email });
        if (validationErrors.length > 0) {
            return res.status(400).json({ errors: validationErrors });
        }

        const user = await userService.createUser({ first_name, last_name, password, email });
        // Return user info without exposing password
        res.status(201).json({ id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name });
    } catch (error) {
        console.error(error);
        if (error.message === 'User already exists' || error.message === 'Invalid email format' || error.message === 'Bad Request') {
            return res.status(400).send(); // User already exists
        }
        res.status(400).send(); // Handle unexpected errors gracefully
    }
};

const updateUser = async (req, res) => {
    res.set('Cache-Control', 'no-cache');
    res.set('Content-Type', 'application/json');

    try {
        const { email, password } = req.auth;

        // Step 1: Authenticate user
        const user = await userService.authenticateUser(email, password);
        if (!user) {
            throw new Error('Invalid credentials'); 
        }
        const allowedFields = ['first_name', 'last_name', 'password']; 

        // Step 2: Check if the request body is provided
        const requiredFields = ['first_name', 'last_name', 'password', 'email'];
        if (!req.body || Object.keys(req.body).length === 0) {
            throw new Error('Body is missing to update');
        }

        const userId = user.id; 
        const updateData = req.body;
        const validationError = validateUserFields({ first_name, last_name, password, email });
        if (validationError.length > 0) {
            return res.status(400).send();
        }



        // Step 3: Validate ownership (user can only update their own information)
        if (updateData.email && updateData.email !== email) {
            throw new Error('Unauthorized'); 
        }

        // Validate fields
        const validationErrors = validateUserFields(updateData);
        if (validationErrors.length > 0) {
            return res.status(400).json({ errors: validationErrors });
        }

        const missingFields = requiredFields.filter(field => !updateData[field]);
        if (missingFields.length > 0) {
            throw new Error('Body is missing to update'); // Throw error if any required field is missing
        }

        // Step 4: Check for invalid fields
        const invalidFields = Object.keys(updateData).filter(key => !allowedFields.includes(key) && key !== 'email');
        if (invalidFields.length > 0) {
            throw new Error('Bad Request: Invalid fields in request body'); // Throw error for invalid fields
        }

        // Step 5: Update user information, omitting email if it's present
        if (updateData.email) {
            delete updateData.email; // Remove email from update data
        }

        await userService.updateUser(userId, updateData);

        // Step 6: Send success response
        return res.status(204).send();

    } catch (error) {
        // Log the error for debugging
        console.error(error);
        if (error.message === 'Invalid credentials' || error.message === 'Unauthorized' || error.message === 'User not found') {
            return res.status(401).send(); // Return 401 for invalid credentials or unauthorized access
        } else if (error.message === 'Bad Request' || error.message === 'Body is missing to update') {
            return res.status(400).send(); // Return 400 for bad request errors
        }

        console.error(error); // Log unexpected errors
        return res.status(400).send(); // Return 400 for unexpected errors
    }
};

const getUser = async (req, res) => {
    res.set('Cache-Control', 'no-cache');
    res.set('Content-Type', 'application/json');

    try {
        const { email, password } = req.auth;
        const user = await userService.authenticateUser(email, password);
        validateRequest(req);
        
        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Get user information
        const userId = user.id; 
        const userInfo = await userService.getUser(userId);
        
        res.status(200).json(userInfo); 
    } catch (error) {
        console.error(error);
        
        // Handle different error scenarios
        if (error.message === 'Invalid credentials' || error.message === 'User not found') {
            return res.status(401).send(); // Return 401 for invalid credentials
        } else if (error.message === 'Bad Request') {
            return res.status(400).send(); 
        }
    }
};

module.exports = {
    createUser,
    updateUser,
    getUser,
};
