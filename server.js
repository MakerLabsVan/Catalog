var path = __dirname;
var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var gapi = require(path + "/app/components/googlesheets/googlesheetsapi.js");

app.use("/", router);
app.use(express.static(path));
app.use(bodyParser.json());

function getData(fn) {
    gapi.auth(gapi.listMajors, function (result) {
        fn(result);
    });
}

function getReadRes(fn) {
    gapi.auth(gapi.sheetWrite, function (result) {
        fn(result);
    });
}


app.get("/", function (req, res) {
    res.sendFile(path + '/views/index.html');
});

app.get("/input", function (req, res) {
    res.sendFile(path + '/views/input.html');
});

app.post("/input", function (req, res) {
    console.log(req.body);
})

app.get("/getData", function (req, res) {
    getData(function (result) {
        return res.json(result);
    });
});

app.listen(3000, function () {
    console.log("Live at Port 3000");
});
