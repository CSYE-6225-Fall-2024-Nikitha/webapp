const express = require('express');
const { createUser, updateUser, getUser } = require('../controllers/userController'); // Adjust the path if needed

const router = express.Router();
const userController = require('../controllers/userController');
const userAuth = require('../utils/userAuth');


router.post('/', createUser); 
router.put('/self', userAuth, userController.updateUser); 
router.get('/self', userAuth, userController.getUser); 

module.exports = router;
