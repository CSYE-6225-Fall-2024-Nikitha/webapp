const User = require('../models/User');
const bcrypt = require('bcrypt'); // Ensure bcrypt is imported

const createUser = async ({ email, password, firstName, lastName }) => {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
    });

    return user;
};

const updateUser = async (userId, updateData) => {
    const user = await User.findByPk(userId);

    if (!user) {
        throw new Error('User not found');
    }

    user.firstName = updateData.firstName || user.firstName;
    user.lastName = updateData.lastName || user.lastName;

    if (updateData.password) {
        user.password = await bcrypt.hash(updateData.password, 10); // Hash new password
    }

    await user.save();
    return user;
};

const getUser = async (userId) => {
    const user = await User.findByPk(userId, { attributes: { exclude: ['password'] } });

    if (!user) {
        throw new Error('User not found');
    }

    return user;
};

module.exports = {
    createUser,
    updateUser,
    getUser,
};
