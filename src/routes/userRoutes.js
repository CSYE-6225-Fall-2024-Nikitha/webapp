const express = require('express');
const { createUser, updateUser, getUser } = require('../controllers/userController'); 
const userAuth = require('../utils/userAuth');
const checkConnection = require('../utils/checkConnection');
const handleJsonSyntaxError = require('../utils/handleJsonSyntaxError'); 
const router = express.Router();


router.head('/self', (req, res) => {
  res.status(405).end();
});

router.head('/', (req, res) => {
  res.status(405).end();
});

router.post('/',checkConnection,handleJsonSyntaxError, createUser);

router.get('/self',checkConnection, userAuth, handleJsonSyntaxError, getUser);
router.put('/self',checkConnection, userAuth, handleJsonSyntaxError, updateUser);


router.all('/self', (req, res) => {
    res.status(405).send(); 
});

router.all('/', (req, res) => {
    res.status(405).send(); 
});

router.all('*', (req, res) => {
    res.status(404).send(); 
});

module.exports = router;
