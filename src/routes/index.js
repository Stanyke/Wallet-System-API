const userRoutes = require('./UserRoutes');
module.exports = (router) => {
    router.use('/api/v1', userRoutes())

    return router;
}