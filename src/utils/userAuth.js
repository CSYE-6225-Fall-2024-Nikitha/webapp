const userAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).send(); // Unauthorized
  }
  
  const token = authHeader.split(' ')[1];
  const credentials = Buffer.from(token, 'base64').toString('utf-8').split(':');
  const email = credentials[0]; // Username (email)
  const password = credentials[1]; // Password

  // Store email and password in request object for further processing
  req.auth = { email, password };
  next();
};

module.exports = userAuth;
