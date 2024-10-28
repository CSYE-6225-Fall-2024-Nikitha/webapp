const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { isValidEmail } = require('../utils/emailValidation');
const { logger, logApiCall, logDbQuery } = require('../utils/logger'); // Import your logger and metrics functions

const authenticateUser = async (email, password) => {
    const startTime = Date.now();
    try {
        const userStart = Date.now(); // Start timer for the database query
        const user = await User.findOne({ where: { email: email } });
        const userDuration = Date.now() - userStart; // Calculate duration for the DB query
        logDbQuery(userDuration); // Log the DB query duration

        if (!user) {
            throw new Error('User not found');
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        return user;
    } finally {
        const duration = Date.now() - startTime;
        logApiCall('authenticateUser', duration);
        logger.info(`Authenticate user request took ${duration}ms`);
    }
};

const createUser = async ({ first_name, last_name, password, email }) => {
    const startTime = Date.now();
    try {
        if (!isValidEmail(email)) {
            throw new Error('Invalid email format');
        }
        
        const existingUserStart = Date.now(); // Start timer for the database query
        const existingUser = await User.findOne({ where: { email: email } });
        const existingUserDuration = Date.now() - existingUserStart; // Calculate duration for the DB query
        logDbQuery(existingUserDuration); // Log the DB query duration

        if (existingUser) {
            throw new Error('User already exists');
        }

        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        const createUserStart = Date.now(); // Start timer for the database query
        const user = await User.create({
            email: email,
            password: hashedPassword,
            first_name,
            last_name,
        });
        const createUserDuration = Date.now() - createUserStart; // Calculate duration for the DB query
        logDbQuery(createUserDuration); // Log the DB query duration

        return user;
    } finally {
        const duration = Date.now() - startTime;
        logApiCall('createUser', duration);
        logger.info(`Create user request took ${duration}ms`);
    }
};

const updateUser = async (userId, updateData) => {
    const startTime = Date.now();
    try {
        const userStart = Date.now(); // Start timer for the database query
        const user = await User.findByPk(userId);
        const userDuration = Date.now() - userStart; // Calculate duration for the DB query
        logDbQuery(userDuration); // Log the DB query duration

        if (!user) {
            throw new Error('User not found');
        }
        
        // Only update allowed fields
        if (updateData.first_name) {
            user.first_name = updateData.first_name;
        }
        if (updateData.last_name) {
            user.last_name = updateData.last_name;
        }
        if (updateData.password) {
            const salt = await bcrypt.genSalt(saltRounds);
            user.password = await bcrypt.hash(updateData.password, salt);
        }

        user.account_updated = new Date();
        const saveStart = Date.now(); // Start timer for saving the user
        await user.save();
        const saveDuration = Date.now() - saveStart; // Calculate duration for saving
        logDbQuery(saveDuration); // Log the DB query duration

        return user;
    } finally {
        const duration = Date.now() - startTime;
        logApiCall('updateUser', duration);
        logger.info(`Update user request took ${duration}ms`);
    }
};

const getUser = async (userId) => {
    const startTime = Date.now();
    try {
        const userStart = Date.now(); // Start timer for the database query
        const user = await User.findByPk(userId, { attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } });
        const userDuration = Date.now() - userStart; // Calculate duration for the DB query
        logDbQuery(userDuration); // Log the DB query duration

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    } finally {
        const duration = Date.now() - startTime;
        logApiCall('getUser', duration);
        logger.info(`Get user request took ${duration}ms`);
    }
};

module.exports = {
    authenticateUser,
    createUser,
    updateUser,
    getUser,
};
