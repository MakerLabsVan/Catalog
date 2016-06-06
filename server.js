var path = __dirname;
var express = require('express');
var app = express();
var router = express.Router();
var gapi = require(path + "/app/components/googlesheets/googlesheetsapi.js");

app.use("/", router);
app.use(express.static(path));

function getData(fn) {
    gapi.auth(gapi.listMajors, function (result) {
        fn(result);
    });
}

app.get("/", function (req, res) {
    res.sendFile(path + '/views/index.html');
});

app.get("/getData", function (req, res) {
    getData(function (result) {
        console.log(result);
        return res.json(result);
    });
});

app.listen(3000, function () {
    console.log("Live at Port 3000");
});
