const User = require('../models/User');

const createUser = async (req, res) => {
    const { user, password, firstName, lastName } = req.body;

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).send(); // 400 Bad Request for existing email
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email,
            password: hashedPassword,
            firstName,
            lastName,
        });

        res.status(201).json({ id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName });
    } catch (error) {
        console.error(error);
        res.status(500).send(); // 500 Internal Server Error
    }
};

// Update User Information
const updateUser = async (req, res) => {
    const { firstName, lastName, password } = req.body;

    try {
        const userId = req.user.id; // Get user ID from authenticated token
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).send(); // User not found
        }

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;

        if (password) {
            user.password = await bcrypt.hash(password, 10); // Hash new password
        }

        await user.save();
        res.status(200).send(); // Success
    } catch (error) {
        console.error(error);
        res.status(500).send(); // 500 Internal Server Error
    }
};

// Get User Information
const getUserInfo = async (req, res) => {
    try {
        const userId = req.user.id; // Get user ID from authenticated token
        const user = await User.findByPk(userId, { attributes: { exclude: ['password'] } });

        if (!user) {
            return res.status(404).send(); // User not found
        }

        res.status(200).json(user); // Return user info without password
    } catch (error) {
        console.error(error);
        res.status(500).send(); // 500 Internal Server Error
    }
};

module.exports = {
    createUser,
    updateUser,
    getUserInfo,
};
