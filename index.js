const winston = require('winston')
const express = require('express');

// install lib called supertests for running integration tests.
// npm i supertest --save-dev

const app = express();
require('./startup/logging')();
require('./startup/config')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/validation')();
require('./startup/prod')(app);

// errors thrown outside of the processing context will not be caught/ logged  by winston. 
//  throw new Error('Something failed during startup.... ');
// such errors can be caught by process.on (event emitter ) as shown below 

// the approach above will not catch unhandled promise rejections.
// as shownbelow 
//const p = Promise.reject(new Error('Something failed miserably...'));
//p.then(() => console.log('Done')); // notice we are not calling .catch so the promise so this promise will be
// in order to handle this we need to subscribe to unhandledRejectionssee above 



const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));
module.exports = server;
