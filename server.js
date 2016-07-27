var path = __dirname;
var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var serverOps = require(path + "/serverOps.js");
// var S3Ops = require(path + "/S3Ops.js");
var public_serverOps = require(path + "/static/app/components/googlesheets/public_gapi.js");
require('./routes')(router, path, serverOps, public_serverOps);

app.use(bodyParser.json());
app.use(express.static(path + '/static'));
app.use('/', router);

app.listen(PORT, function () {
    console.log("Live at Port 3000");
});
