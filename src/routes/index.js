const healthCheckRoute = require('./healthRoutes.js');
const userRoute = require('./userRoutes.js');
const verifyRoute = require('./verifyRoutes.js');


const registerRouter = (app) => {
    app.use('/healthz', healthCheckRoute);
   // app.use('/cicd', healthCheckRoute);
    app.use('/v1/user', userRoute);
    app.use('/verify', verifyRoute);

};

module.exports = registerRouter;
