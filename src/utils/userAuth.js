const userAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).send(); // Unauthorized
  }
  
  const token = authHeader.split(' ')[1];
  const credentials = Buffer.from(token, 'base64').toString('utf-8').split(':');
  if (credentials.length !== 2) {
    return res.status(401).json();
  }

  const email = credentials[0]; 
  const password = credentials[1];

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
      return res.status(400).send();
  }
  req.auth = { email, password };
  next();
};

module.exports = userAuth;
