const registerRouter = require('./routes/index.js');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
 

const app = express();
// app.use(cors());
app.use(express.json());

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      console.error('Bad JSON format:', err.message);
      return res.status(400).json();
  }
  next(); 
});

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// setup routes
registerRouter(app);
module.exports = app;
