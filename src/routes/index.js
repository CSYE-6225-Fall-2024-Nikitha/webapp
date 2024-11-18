const healthCheckRoute = require('./healthRoutes.js');
const userRoute = require('./userRoutes.js');
const {verifyEmail } = require('../controllers/userController'); 


const registerRouter = (app) => {
    app.use('/healthz', healthCheckRoute);
    app.use('/v1/user', userRoute);
    app.use('/verify', verifyEmail);

};

module.exports = registerRouter;