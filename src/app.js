const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const healthRoutes = require('./routes/healthRoutes');
require('dotenv').config();

app.use(express.json());
app.use('/', healthRoutes);

app.use(bodyParser.json({
  limit: '1mb'
}));

// error handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError) {
    return res.status(400).send(); 
}
next();
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app; 