const express = require('express');
const { createUser, updateUser, getUser } = require('../controllers/userController'); // Adjust the path if needed
const userAuth = require('../utils/userAuth');
const startConnection = require('../utils/checkConnection'); // Adjust the path if needed
const checkConnection = require('../utils/checkConnection');


const router = express.Router();

router.post('/',checkConnection, createUser);

router.get('/self',checkConnection, userAuth, getUser);
router.put('/self',checkConnection, userAuth, updateUser);

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
