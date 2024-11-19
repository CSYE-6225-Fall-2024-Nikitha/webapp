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
        if (['User already exists', 'Invalid email format', 'Bad Request'].includes(error.message) || error instanceof SyntaxError ) {
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
            // was 403 before
            return res.status(400).send();
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
        if (error.message === 'Invalid credentials' || error.message === 'User not found' || error.message === 'User not verified') {
            return res.status(401).send(); 
        } else if (error.message === 'Body is missing to update' || error.message === 'Bad Request') {
            return res.status(400).send(); // Return 400 for bad request errors
        } else if (error.message === 'Forbidden user') {
            return res.status(400).send(); 
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
        if (error.message === 'Invalid credentials' || error.message === 'User not found'|| error.message === 'User not verified') {
                return res.status(401).send(); 
        } else if (error.message === 'Bad Request' || err instanceof SyntaxError ) {
            return res.status(400).send(); 
        }
        return res.status(400).send(); 
    }
};

// VERIFY EMAIL
const verifyEmail = async (req, res) => {
    res.set('Cache-Control', 'no-cache');
    res.set('Content-Type', 'application/json');

    const { email, token } = req.query;

    if (!email || !token) {
        return res.status(400).json({ message: 'No email or token found' });   
    }

    try {
        const result = await userService.verifyEmail(email, token);
        if (result === 'ALREADY_VERIFIED') {
            return res.status(400).json({message: 'Token already verified'}); 
        }
        if (result === 'INVALID_TOKEN') {
            return res.status(400).json({message: 'Invalid token'}); 
        }
        if (result === 'EXPIRED_TOKEN') {
            return res.status(400).json({message: 'Expired token'}); 
        }

        res.set('Content-Type', 'text/html');
        return res.status(200).send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Email Verification Successful</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f7fa;
                  margin: 0;
                  padding: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                }
          
                .container {
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 8px;
                  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
                  text-align: center;
                  max-width: 400px;
                  margin: 20px;
                  font-size: 16px;
                }
          
                h1 {
                  color: #4CAF50;
                  font-size: 2.5em;
                }
          
                p {
                  color: #333;
                  line-height: 1.6;
                  margin-bottom: 20px;
                }
          
                .button {
                  background-color: #4CAF50;
                  color: white;
                  padding: 10px 20px;
                  border: none;
                  border-radius: 5px;
                  text-decoration: none;
                  font-weight: bold;
                  cursor: pointer;
                  transition: background-color 0.3s ease;
                }
          
                .button:hover {
                  background-color: #45a049;
                }
          
                .emoji {
                  font-size: 3em;
                  margin: 20px 0;
                }
          
                footer {
                  font-size: 14px;
                  color: #888;
                  margin-top: 20px;
                }
          
              </style>
            </head>
            <body>
              <div class="container">
                <div class="emoji">🎉</div>
                <h1>Email Verified!</h1>
                <p>Congratulations, your email has been successfully verified! You're now ready to explore all the features.</p>
                <a href="/" class="button">Go to Home</a>
                <footer>Need help? <a href="mailto:support@nikitha-kambhampati.me">Contact Support</a></footer>
              </div>
            </body>
            </html>
          `);
          
    } catch (error) {
        console.error(error);
        if (['User not found', 'Invalid request'].includes(error.message)) {
            return res.status(400).json({message: error.message});
        }
        return res.status(400).json({message: error.message});
    }
};

module.exports = {
    createUser,
    updateUser,
    getUser,
    verifyEmail
};