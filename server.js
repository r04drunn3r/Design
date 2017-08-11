// set up ======================================================================
var express = require('express');
var app = express(); // create  app w/ express
var database = require('./config/database'); // load the database config
var http = require('http'); //for ssl
var morgan = require('morgan'); // log requests to the console (express4)
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var fs=require('fs');
// configuration ===============================================================
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
var LogStream = fs.createWriteStream( 'Logs/Design.log', {flags: 'a'})
app.use(morgan('dev'));
app.use(morgan('combined',{stream: LogStream})); 										// log every request to the console and the file
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
})); // parse application/vnd.api+json as json
app.use(methodOverride());
// routes ======================================================================
require('./app/routes.js')(app);
http.createServer(app).listen(3000, function () {
    console.log('Process ' + process.pid + ' is listening to all incoming requests');
});