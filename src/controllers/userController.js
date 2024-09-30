const userService = require('../services/userService'); 

const createUser = async (req, res) => {
    const { email, password, firstName, lastName } = req.body;

    try {
        const user = await userService.createUser({ email, password, firstName, lastName });
        res.status(201).json({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName });
    } catch (error) {
        console.error(error);
        if (error.message === 'User already exists') {
            return res.status(400).send();
        }
        res.status(500).send();
    }
};

const updateUser = async (req, res) => {
    const { firstName, lastName, password } = req.body;

    try {
        const userId = req.user.id; 
        await userService.updateUser(userId, { firstName, lastName, password });
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
    try {
        const userId = req.user.id; 
        const user = await userService.getUser(userId);
        res.status(200).json(user); 
    } catch (error) {
        console.error(error);
        if (error.message === 'User not found') {
            return res.status(404).send();
        }
        res.status(500).send(); 
    }
};

module.exports = {
    createUser,
    updateUser,
    getUser,
};
