const User = require('../models/User');
const bcrypt = require('bcrypt');
const { isValidEmail } = require('../utils/emailValidation'); // Import the validation function


const authenticateUser = async (email, password) => {
  const user = await User.findOne({ where: { username: email } }); // Assuming username is the email

  if (!user) {
      throw new Error('User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
      throw new Error('Invalid credentials');
  }

  return user; 
};

const createUser = async ({first_name, last_name, password, email }) => {
  if (!isValidEmail(email)) {
    throw new Error('Invalid email format'); // Throw an error for invalid email
}
    const existingUser = await User.findOne({ where: { username: email } });
    if (existingUser) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
        username: email,  // Use email as the username
        password: hashedPassword,
        first_name,
        last_name,
    });

    return user;
};


const updateUser = async (userId, updateData) => {
  const user = await User.findByPk(userId);

  if (!user) {
      throw new Error('User not found');
  }

  // Only update allowed fields
  if (updateData.firstName) {
      user.firstName = updateData.firstName;
  }
  if (updateData.lastName) {
      user.lastName = updateData.lastName;
  }
  if (updateData.password) {
      user.password = await bcrypt.hash(updateData.password, 10);
  }

  user.account_updated = new Date();

  // Save the changes
  await user.save();
  return user;
};



const getUser = async (userId) => {
    const user = await User.findByPk(userId, { attributes: { exclude: ['password','createdAt', 'updatedAt'] } });

    if (!user) {
        throw new Error('User not found');
    }

    return user;
};

module.exports = {
  authenticateUser,
    createUser,
    updateUser,
    getUser,
};
