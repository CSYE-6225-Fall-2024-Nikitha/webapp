const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { isValidEmail } = require('../utils/emailValidation');
const { logger, logDbQuery } = require('../utils/logger'); 

const authenticateUser = async (email, password) => {
    const startTime = Date.now(); 
    try {
        const userStartTime = Date.now(); 
        const user = await User.findOne({ where: { email: email } });
        const userDuration = Date.now() - userStartTime; 
        logDbQuery(userDuration); 

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
        logger.info(`Authenticate user request took ${duration}ms`);
    }
};

const createUser = async ({ first_name, last_name, password, email }) => {
    const startTime = Date.now(); 
    try {
        if (!isValidEmail(email)) {
            throw new Error('Invalid email format');
        }

        const existingUserStartTime = Date.now(); 
        const existingUser = await User.findOne({ where: { email: email } });
        const existingUserDuration = Date.now() - existingUserStartTime; 
        logDbQuery(existingUserDuration); 

        if (existingUser) {
            throw new Error('User already exists');
        }

        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        const createUserStartTime = Date.now(); 
        const user = await User.create({
            email: email,
            password: hashedPassword,
            first_name,
            last_name,
        });
        const createUserDuration = Date.now() - createUserStartTime;
        logDbQuery(createUserDuration); 

        return user;
    } finally {
        const duration = Date.now() - startTime; 
        logger.info(`Create user request took ${duration}ms`);
    }
};

const updateUser = async (userId, updateData) => {
    const startTime = Date.now(); 
    try {
        const userStartTime = Date.now(); 
        const user = await User.findByPk(userId);
        const userDuration = Date.now() - userStartTime; 
        logDbQuery(userDuration); 

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
        const saveStartTime = Date.now(); 
        await user.save();
        const saveDuration = Date.now() - saveStartTime; 
        logDbQuery(saveDuration); 

        return user;
    } finally {
        const duration = Date.now() - startTime; 
        logger.info(`Update user request took ${duration}ms`);
    }
};

const getUser = async (userId) => {
    const startTime = Date.now(); 
    try {
        const userStartTime = Date.now(); 
        const user = await User.findByPk(userId, { attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } });
        const userDuration = Date.now() - userStartTime; 
        logDbQuery(userDuration); 

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    } finally {
        const duration = Date.now() - startTime;
        logger.info(`Get user request took ${duration}ms`);
    }
};

module.exports = {
    authenticateUser,
    createUser,
    updateUser,
    getUser,
};
