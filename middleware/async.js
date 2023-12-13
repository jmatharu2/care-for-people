// in order to avoid repteadly calloing this function from all the route handlers we can user the 
// module express-async-errors module which will automatically wrap all our routes with this handler
// we are not using this because we are using express-async-errors module to wrap our handlers. 
// if for some reason it does not work then we can use this middleware function

module.exports = function asyncMiddleware(handler) {
    return async (req, res, next) => {
        try {
           await handler(req, res);
        } catch (ex) {
            next(ex);
        }
    };
}