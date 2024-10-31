const healthCheckRoute = require('./healthRoutes.js');
const userRoute = require('./userRoutes.js');

const registerRouter = (app) => {
    app.use('/healthz', healthCheckRoute);
    app.use('/v1/user', userRoute);

};

module.exports = registerRouter;