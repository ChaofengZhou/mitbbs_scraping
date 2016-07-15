process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var logger = require('morgan');
var http = require('http');
var path = require('path');
var config = require('./config');

var app = express();
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect(config.database);

var clientPath = path.join(__dirname, '../client');
if (app.get('env') === 'development') {
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });
} else {
  clientPath = path.join(__dirname, '../client/asset');
}

app.use(express.static(clientPath));

app.use('/api/posts', require('./api/post/post.route'));
app.get('*', function(req, res) {
  res.sendFile(clientPath + '/index.html');
});

var server = http.createServer(app).listen(config.port, function() {
  console.log('Server is listening on ' + config.port);
});

module.exports = app;
