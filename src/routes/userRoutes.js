const express = require('express');
const { createUser, updateUser, getUser } = require('../controllers/userController'); 
const userAuth = require('../utils/userAuth');
const checkConnection = require('../utils/checkConnection');

const router = express.Router();

router.head('/self', (req, res) => {
    res.status(405).end();
});

router.head('/', (req, res) => {
    res.status(405).end();
});

router.post('/', checkConnection, createUser);

router.get('/self', checkConnection, userAuth, getUser);

router.put('/self', checkConnection, userAuth, updateUser);

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
