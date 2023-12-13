const winston = require('winston');

module.exports = function(err, req, res, next) {
    // Internal server error
    // in order to log our exception we will use winston module.
    //winston.log('error', err.message);
    //or user helper method pass message and meta data 
     winston.error(err.message, err);
    // logging levels - error, warn, info, verbose, debug, silly 
    res.status(500).send('Something failed');
 }