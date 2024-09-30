const express = require('express');
const { createUser, updateUser, getUser } = require('../controllers/userController'); // Adjust the path if needed

const router = express.Router();

router.post('/', createUser); 
router.put('/self', updateUser); 
router.get('/self', getUser); 

module.exports = router;
