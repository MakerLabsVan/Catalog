var path = __dirname;
var PORT = process.env.PORT || 3000;
var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var s3Ops = require(path + "/static/app/components/AWS/s3api.js");
var serverOps = require(path + "/serverOps.js");
var public_serverOps = require(path + "/static/app/components/googlesheets/public_gapi.js");
require('./routes')(router, path, serverOps, public_serverOps, s3Ops);

app.use(bodyParser.json());
app.use(express.static(path + '/static'));
app.use('/', router);

app.listen(PORT, function () {
    console.log("Live at Port 3000");
});
