const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { isValidEmail } = require('../utils/emailValidation');
const { logger, logApiCall, logDbQuery } = require('../utils/logger'); // Adjust the path as necessary

const authenticateUser = async (email, password) => {
    const startTime = Date.now(); // Start timer for the API call
    try {
        const userStartTime = Date.now(); // Start timer for DB query
        const user = await User.findOne({ where: { email: email } });
        const userDuration = Date.now() - userStartTime; // Calculate duration
        logDbQuery(userDuration); // Log DB query duration

        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }
        return user;
    } finally {
        const duration = Date.now() - startTime; // API call duration
        logApiCall('authenticateUser', duration); // Log API call metrics
        logger.info(`Authenticate user request took ${duration}ms`);
    }
};

const createUser = async ({ first_name, last_name, password, email }) => {
    const startTime = Date.now(); // Start timer for the API call
    try {
        if (!isValidEmail(email)) {
            throw new Error('Invalid email format');
        }

        const existingUserStartTime = Date.now(); // Start timer for existing user check
        const existingUser = await User.findOne({ where: { email: email } });
        const existingUserDuration = Date.now() - existingUserStartTime; // Calculate duration
        logDbQuery(existingUserDuration); // Log DB query duration

        if (existingUser) {
            throw new Error('User already exists');
        }

        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        const createUserStartTime = Date.now(); // Start timer for user creation
        const user = await User.create({
            email: email,
            password: hashedPassword,
            first_name,
            last_name,
        });
        const createUserDuration = Date.now() - createUserStartTime; // Calculate duration
        logDbQuery(createUserDuration); // Log DB query duration

        return user;
    } finally {
        const duration = Date.now() - startTime; // API call duration
        logApiCall('createUser', duration); // Log API call metrics
        logger.info(`Create user request took ${duration}ms`);
    }
};

const updateUser = async (userId, updateData) => {
    const startTime = Date.now(); // Start timer for the API call
    try {
        const userStartTime = Date.now(); // Start timer for fetching user
        const user = await User.findByPk(userId);
        const userDuration = Date.now() - userStartTime; // Calculate duration
        logDbQuery(userDuration); // Log DB query duration

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
        const saveStartTime = Date.now(); // Start timer for saving user
        await user.save();
        const saveDuration = Date.now() - saveStartTime; // Calculate duration
        logDbQuery(saveDuration); // Log DB query duration

        return user;
    } finally {
        const duration = Date.now() - startTime; // API call duration
        logApiCall('updateUser', duration); // Log API call metrics
        logger.info(`Update user request took ${duration}ms`);
    }
};

const getUser = async (userId) => {
    const startTime = Date.now(); // Start timer for the API call
    try {
        const userStartTime = Date.now(); // Start timer for fetching user
        const user = await User.findByPk(userId, { attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } });
        const userDuration = Date.now() - userStartTime; // Calculate duration
        logDbQuery(userDuration); // Log DB query duration

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    } finally {
        const duration = Date.now() - startTime; // API call duration
        logApiCall('getUser', duration); // Log API call metrics
        logger.info(`Get user request took ${duration}ms`);
    }
};

module.exports = {
    authenticateUser,
    createUser,
    updateUser,
    getUser,
};
