const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

// NODE_ENV variable will determine which db is getting connected to 
// while doing tests NODE_ENV gets set to test
module.exports = function() {
    mongoose.connect( config.get('db'))
  .then(() => winston.info(`Connected to ${ config.get('db') }...`));
  //.catch(err => console.error('Could not connect to MongoDB...'));
}