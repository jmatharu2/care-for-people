
require('express-async-errors');  // by using this we dont have to wrap all our handlers in a call to async
const winston = require('winston'); // comes with 3 transports console, file and http comes with plugin to log messages in mongodb, couchdb,Rdeis, loggy
//require('winston-mongodb'); commented for integration testing

module.exports = function() {
    // winston comes with a defult transport for logging into console
// add a file transport to winston as follows 
//winston.add(new winston.transports.File(), {filename: 'logfile.log'});
winston.add( new winston.transports.File({filename: 'logfile.log'}));
winston.add( new winston.transports.Console({colorize: true, prettyPrint: true }));

// to log error messages to mongo-db we need to install winston-mongodb package 
// as the second argument you can pass level levels - error, warn, info, verbose, debug, silly
// commented for integration testing
//winston.add( new winston.transports.MongoDB({db: 'mongodb://localhost/vidly'}));

//this will catch uncaught exceptions and pass them on to winston which will then log them 
 process.on('uncaughtException', (ex) => {
     console.log('WE GOT AN UNCAUGHT EXCEPTION');
     winston.error(ex.message, ex);
     //process.exit(1);
 })
// alternate to this is a winston helper method to handle exceptions to a different transport 
//winston.handleExceptions({finename: 'uncaughtExceptions.log'});

// new version uses these 
//winston.ExceptionHandler({finename: 'uncaughtExceptions.log'});
//winston.RejectionHandler({finename: 'uncaught.log'});

// There is no helper method in winston to handle unhandled rejections. a trick to this is to throw an exception from 
// unhandledRejections subscribed block. which is then be caught by winston unhandled exceptions
 process.on('unhandledRejection', (ex) => {
    //      console.log('WE GOT AN unhandled rejection');
    //     winston.error(ex.message, ex);
    //process.exit(1);
   throw ex;
 })


}