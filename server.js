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

getData(function(result){
    console.log(result);
})
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
*/
var testData = {
    "majorDimension": "ROWS",
    "values": [
        ["Item", "More", "Memes", "Dank", "Harry"],
        ["Too", "Many", "Memes", "Holy", "Lord"]
    ],
}

// THIS WORKS
// gapi.auth(gapi.sheetWrite, testData);

function parse(req) {
    var stdData = {
        "majorDimension": "ROWS",
        "values": [
            [req.body.Name, req.body.Type, req.body.LocX, req.body.LocY, req.body.Floor, req.body.DimW, req.body.DimL, req.body.DimH, req.body.DimU, req.body.Weight, req.body.Qty, req.body.Price]
        ]
    }
    console.log(stdData);
    // gapi.auth(gapi.sheetWrite, stdData);
}

app.get("/", function (req, res) {
    res.sendFile(path + '/views/index.html');
});

app.get("/input", function (req, res) {
    res.sendFile(path + '/views/input.html');
});


app.post("/input", function (req, res) {
    parse(req);
})

app.get("/getData", function (req, res) {
    getData(function (result) {
        return res.json(result);
    });
});

app.listen(3000, function () {
    console.log("Live at Port 3000");
});
