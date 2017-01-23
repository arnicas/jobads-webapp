'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());

app.use(express.static('public'));
// app.use('/api', require('./api'));

let serverPort = process.env.PORT || 8080;
app.listen(serverPort, function () {
    console.log('Application started on port ' + serverPort);
});