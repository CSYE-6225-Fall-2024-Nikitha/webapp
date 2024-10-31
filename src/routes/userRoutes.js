const express = require('express');
const { createUser, updateUser, getUser } = require('../controllers/userController'); 
const { getImage, postImage, deleteImage } = require('../controllers/imageController');
const multer = require('multer');
const userAuth = require('../utils/userAuth');
const checkConnection = require('../utils/checkConnection');
const { apiMetricsMiddleware } = require('../controllers/apiMetricsMiddleware'); 


const router = express.Router();
const upload = multer({ dest: 'uploads/' });


router.use(apiMetricsMiddleware);
router.head('/self', (req, res) => {
    res.status(405).end();
});
router.head('/self/pic', (req, res) => {
    res.status(405).end();
});

router.head('/', (req, res) => {
    res.status(405).end();
});

router.post('/', checkConnection, createUser);

router.get('/self', checkConnection, userAuth, getUser);

router.put('/self', checkConnection, userAuth, updateUser);

router.post('/self/pic', checkConnection, userAuth,upload.single('image'), postImage);

router.get('/self/pic', checkConnection, userAuth, getImage);

router.delete('/self/pic', checkConnection, userAuth, deleteImage);

router.all('/self', (req, res) => {
    res.status(405).send(); 
});

router.all('/self/pic', (req, res) => {
    res.status(405).send();
})

router.all('/', (req, res) => {
    res.status(405).send(); 
});

router.all('*', (req, res) => {
    res.status(404).send(); 
});

module.exports = router;