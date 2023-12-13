
module.exports = function (req, res, next) {
    // 401 unauthorized -- when an invalid web token was provided 
    // 403 forbidden -- users dont have access to this resource 
   if (!req.user.isAdmin) return res.status(403).send('Access Denied ...');
   next();

}