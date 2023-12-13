
// getting your application production ready 
// all the middleware required for production should reside here

// helmet -- prevents your applications from well known vernerabilities 
// intall helmet 



const helmet = require('helmet');
const compression = require('compression');

// function takes application object as a parameter 
//it is used to install these midelware pieces 
module.exports = function (app) {
    app.use(helmet());
    app.use(compression());
}

// go tp index.js and call this function

// we will be using heruku to deploy our application 
// we need to do two steps 
// 1) create heruku account 
// 2) install heruku CLI 
// you might get error logging into heroku if you are behind a firewall 
// in that case you need to set an environment variable 
// set HTTP_PROXY=http://proxy.server.com:1234
// in the package.json configure the heroku start command under the scripts section 
// in the package.json add a engines section to the version of node we are using check it using node -v 
// before deployint we need to add our source code to git 
// install git 
// git init
// add a gitignor file
