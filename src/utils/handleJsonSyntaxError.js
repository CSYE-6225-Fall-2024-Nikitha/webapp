const handleJsonSyntaxError = (req, res, next) => {
  if (req.is('application/json')) {
      try {
          JSON.parse(JSON.stringify(req.body)); 
      } catch (err) {
          if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
              console.error('Bad JSON format:', err.message);
              return res.status(400).json({ error: 'Bad JSON format' });
          }
      }
  }
  next();
};

module.exports = handleJsonSyntaxError; 