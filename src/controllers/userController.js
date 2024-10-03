const userService = require('../services/userService');
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

// CREATE USER
const createUser = async (req, res) => {
    res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
    });

    const allowedFields = ['first_name', 'last_name', 'password', 'email'];
    
    const invalidFields = Object.keys(req.body).filter(field => !allowedFields.includes(field));
    if (invalidFields.length > 0) {
        return res.status(400).send();
    }

    try {
        // Validate user fields
        const { first_name, last_name, password, email } = req.body;
        const validationErrors = validateUserFields({ first_name, last_name, password, email });
        if (validationErrors.length > 0) {
            return res.status(400).send();
        }

        // Create the user
        const user = await userService.createUser({ first_name, last_name, password, email });

        return res.status(201).json({
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            account_created:user.account_created,
            account_updated:user.account_updated
        });
    } catch (error) {
        console.error(error);
        if (['User already exists', 'Invalid email format', 'Bad Request'].includes(error.message) || err instanceof SyntaxError ) {
            return res.status(400).send(); // Known errors return 400
        }

        return res.status(400).send(); 
    }
};


//UPDATE USER
const updateUser = async (req, res) => {
    res.set('Cache-Control', 'no-cache');
   
    res.set('Content-Type', 'application/json');

    try {
        const { email, password } = req.auth;
        const user = await userService.authenticateUser(email, password);
        if (!user) {
            return res.status(401).send(); 
        }

        const allowedFields = ['first_name', 'last_name', 'password'];
        const requiredFields = ['first_name', 'last_name', 'password', 'email'];

        if (req.headers['content-type'] !== 'application/json') {
            return res.status(400).send(); 
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).send(); 
        }

        const userId = user.id; 
        const updateData = req.body;
        const { first_name, last_name, password: newPassword } = updateData;

        if (updateData.email && updateData.email !== email) {
            return res.status(403).send();
        }


        const missingFields = requiredFields.filter(field => !updateData[field]);
        if (missingFields.length > 0) {
            return res.status(400).send(); 
        }

        const invalidFields = Object.keys(updateData).filter(key => !allowedFields.includes(key) && key !== 'email');
        if (invalidFields.length > 0) {
            return res.status(400).send(); 
        }

        const validationError = validateUserFields({ first_name, last_name, password:newPassword, email });
        if (validationError.length > 0) {
            return res.status(400).json({ errors: validationError }); 
        }

        // Step 5: Update user information, omitting email if it's present
        if (updateData.email) {
            delete updateData.email; 
        }

        await userService.updateUser(userId, updateData);

        return res.status(204).send(); 

    } catch (error) {
        console.error(error);
        if (error.message === 'Invalid credentials' || error.message === 'User not found') {
            return res.status(401).send(); 
        } else if (error.message === 'Body is missing to update' || error.message === 'Bad Request') {
            return res.status(400).send(); // Return 400 for bad request errors
        } else if (error.message === 'Forbidden user') {
            return res.status(403).send(); 
        }else if(err instanceof SyntaxError ){
            return res.status(400).send();
        }
        return res.status(400).send(); 
    }
};


//GET USER
const getUser = async (req, res) => {
    res.set('Cache-Control', 'no-cache');
    res.set('Content-Type', 'application/json');

    try {
        const { email, password } = req.auth;

        const user = await userService.authenticateUser(email, password);
        validateRequest(req);
        
        if (!user) {
            return res.status(401).send(); 
        }
        const userId = user.id; 
        const userInfo = await userService.getUser(userId);
        
        return res.status(200).json(userInfo); 

    } catch (error) {
        console.error(error);
        if (error.message === 'Invalid credentials' || error.message === 'User not found') {
                return res.status(401).send(); 
        } else if (error.message === 'Bad Request' || err instanceof SyntaxError ) {
            return res.status(400).send(); 
        }
        return res.status(400).send(); 
    }
};


module.exports = {
    createUser,
    updateUser,
    getUser,
};
