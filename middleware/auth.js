const jwt = require('jsonwebtoken');
const config = require('config');

// we can write the exports here itself
module.exports = function (req, res, next) {
    
     const token = req.header('x-auth-token');
     if (!token) return res.status(401).send('No Token provided');

     try {
            // if token is valid it will be decoded and payload will be returned
            // if not valid it will throw an exception 
            const decoded = jwt.verify(token, config.get('JwtPrivateKey'));
            req.user= decoded;
            next();

     } catch (ex)
     {
        // bad request. Incalid data sent by the client
        res.status(400).send('Invalid Token');
     }
}