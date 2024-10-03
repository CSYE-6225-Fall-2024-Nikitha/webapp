const User = require('../models/User');
const bcrypt = require('bcrypt');
const { isValidEmail } = require('../utils/emailValidation'); 


const authenticateUser = async (email, password) => {
  const user = await User.findOne({ where: { email: email } }); 
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
    throw new Error('Invalid email format'); 
}
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({
        email: email, 
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
  if (updateData.first_name) {
      user.first_name = updateData.first_name;
  }
  if (updateData.last_name) {
      user.last_name = updateData.last_name;
  }
  if (updateData.password) {
      user.password = await bcrypt.hash(updateData.password, 10);
  }

  user.account_updated = new Date();
  await user.save();
  return user;
};



const getUser = async (userId) => {
    const user = await User.findByPk(userId, { attributes: { exclude: ['password','createdAt', 'updatedAt'] } });
    console.log(user);
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
