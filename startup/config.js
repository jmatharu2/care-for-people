
const config = require('config');

module.exports = function() {
    if(!config.get('JwtPrivateKey')) { 
        //console.error('FATAL ERROR JwtPrivateKey not et ... ');
        //process.exit(1);
        throw new Error('FATAL ERROR JwtPrivateKey not et ');
      }
}