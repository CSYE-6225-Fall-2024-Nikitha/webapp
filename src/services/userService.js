const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { isValidEmail } = require('../utils/emailValidation');
const { logger, logDbQuery } = require('../utils/logger'); 
const { v4: uuidv4 } = require('uuid');
const aws = require('aws-sdk');
const sns = new aws.SNS();


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
        if (!user.email_verified) {
            throw new Error('User not verified');
        }

        return user;
    } finally {
        const duration = Date.now() - startTime; 
        logger.info(`Authenticate user request took ${duration}ms`);
    }
};

const createUser = async ({ first_name, last_name, password, email }) => {
    const token = uuidv4();
    const verificationSentTime = new Date();
    const verificationTokenExpiry = new Date(verificationSentTime.getTime() + 2 * 60 * 1000);
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
            token,
            verification_sent_time: verificationSentTime,
            verification_token_expiry: verificationTokenExpiry,
        });
        const createUserDuration = Date.now() - createUserStartTime;
        logDbQuery(createUserDuration); 

         // Publish message to SNS topic
         const snsMessage = JSON.stringify({
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            token: user.token
        });

        const snsParams = {
            Message: snsMessage,
            TopicArn: process.env.SNS_TOPIC_ARN, 
        };

        try {
            await sns.publish(snsParams).promise();
            logger.info(`SNS message published for user: ${user.email}`);
        } catch (snsError) {
            logger.error(`Failed to publish SNS message: ${snsError.message} for user: ${user.email}`);
            throw new Error('SNS message publication failed');
        }

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

const verifyEmail = async (email, token) => {
    const user = await User.findOne({ where: { email } });

    if (!user) {
        throw new Error('User not found');
    }

    if (user.token !== token) {
        return 'INVALID_TOKEN';
    }

    const currentTime = new Date();
    if (user.verification_token_expiry && currentTime > user.verification_token_expiry) {
        return 'EXPIRED_TOKEN';
    }

    if (user.email_verified) {
        return 'ALREADY_VERIFIED';
    }

    user.email_verified = true;
    user.token = null; 
    user.verification_token_expiry = null;

    await user.save();

    return 'VERIFIED';
};


module.exports = {
    authenticateUser,
    createUser,
    updateUser,
    getUser,
    verifyEmail
};
