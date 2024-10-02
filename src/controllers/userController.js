const userService = require('../services/userService');
const userAuth = require('../utils/userAuth');

const createUser = async (req, res) => {
    const {first_name, last_name, password, email } = req.body;

    try {
        const user = await userService.createUser({first_name, last_name, password, email });
        // Return user info without exposing password
        res.status(201).json({ id: user.id, username: user.username, first_name: user.first_name, last_name: user.last_name });
    } catch (error) {
        console.error(error);
        if (error.message === 'User already exists' || error.message === 'Invalid email format') {
            return res.status(400).send(); // User already exists
        }
        res.status(500).send(); // Internal server error
    }
};


const allowedFields = ['firstName', 'lastName', 'password'];

const updateUser = async (req, res) => {
    const updateData = req.body;
    const userId = req.user.id;  

    const invalidFields = Object.keys(updateData).filter(key => !allowedFields.includes(key));
    if (invalidFields.length > 0) {
        return res.status(400).json({ message: 'Bad Request: Invalid fields in request body' });
    }

    try {
        await userService.updateUser(userId, updateData);
        res.status(200).send(); 
    } catch (error) {
        console.error(error);
        if (error.message === 'User not found') {
            return res.status(404).send();
        }
        res.status(500).send();
    }
};


const getUser = async (req, res) => {
  const { email, password } = req.auth;

  try {
      // Authenticate user
      const user = await userService.authenticateUser(email, password);
      
      const userId = user.id; 
      const userInfo = await userService.getUser(userId);
      res.status(200).json(userInfo); 
  } catch (error) {
      console.error(error);
      if (error.message === 'User not found') {
          return res.status(404).send();
      } else if (error.message === 'Invalid credentials') {
          return res.status(401).send(); // Unauthorized
      }
      res.status(500).send(); 
  }
};
module.exports = {
    createUser,
    updateUser,
    getUser,
};
