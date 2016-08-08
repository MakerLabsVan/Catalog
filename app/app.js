var path = __dirname;
var PORT = process.env.PORT || 3000;
var express = require("express");
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
require(path + "/public/public.routes.js")(router, path);

app.use(bodyParser.json());
app.use(express.static(path + "/vendor"));
app.use(express.static(path + "/public"));
app.use(express.static(path + "/img"));
app.use("/", router);

app.listen(PORT || 3000, function () {
    console.log(path);
});