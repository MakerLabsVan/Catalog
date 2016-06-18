var path = __dirname;
var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var gapi = require(path + "/app/components/googlesheets/googlesheetsapi.js");

app.use("/", router);
app.use(express.static(path));
app.use(bodyParser.json());

var getData = function (fn) {
    gapi.auth(gapi.listMajors, function (result) {
        fn(result);
    });
};

/*
    message must be in this format:
    {
        OPTIONAL -> "range" : "A1 notation",
        "majorDimension" : "ROWS or COLS",
        "values": [
            Array ie: ["Item", "Item2", "Item 3"],
                      ["Second Arr Item", "etc"]
        ],
    }

var testData = {
    "majorDimension": "ROWS",
    "values": [
        ["Item", "More", "Memes", "Dank", "Harry"],
        ["Too", "Many", "Memes", "Holy", "Lord"]
    ],
}
*/

// THIS WORKS
// gapi.auth(gapi.sheetWrite, testData);

var parse = function (req, row) {
    // row is the length from data + 2
    var stdData = {
        "majorDimension": "ROWS",
        "values": [
            [req.body.Name, req.body.Type, req.body.LocX, req.body.LocY, req.body.Floor, req.body.DimW, req.body.DimL, req.body.DimH, req.body.DimU, req.body.Weight, req.body.WUnit, req.body.Qty, req.body.Price]
        ]
    }
    console.log(stdData);
    gapi.auth(gapi.sheetWrite, stdData, row);
};

var delEntry = function (index) {
    gapi.auth(gapi.deleteEntry, index);
}

app.get("/", function (req, res) {
    res.sendFile(path + '/views/index.html');
});

app.get("/input", function (req, res) {
    res.sendFile(path + '/views/input.html');
});

app.post("/input", function (req, res) {
    getData(function (result) {
        console.log(result.length);
        parse(req, result.length);
    });
});

app.post("/delete", function (req, res) {
    console.log(req.body[0]);
    delEntry(req.body[0]);
});

app.get("/getData", function (req, res) {
    getData(function (result) {
        return res.json(result);
    });
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Live at Port 3000");
});
