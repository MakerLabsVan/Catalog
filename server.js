var path = __dirname;
var PORT = process.env.PORT || 3000
var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var serverOps = require(path + "/serverOps.js");

app.use("/", router);
app.use(express.static(path + '/static'));
app.use(bodyParser.json());

app.get("/", function (req, res) {
    res.sendFile(path + '/static/views/index.html');
});

app.get("/input", function (req, res) {
    res.sendFile(path + '/static/views/input.html');
});

app.post("/input", function (req, res) {
    // serverOps.getData(function (result) {
    //     console.log(result.length);
    //     serverOps.parse(req, result.length);
    // });
    console.log(req.body);
});

app.post("/edit", function (req, res) {
    serverOps.parse(req.body[0], req.body[1]);
})

app.post("/delete", function (req, res) {
    console.log(req.body[0]);
    serverOps.delEntry(req.body[0]);
});

app.get("/getData", function (req, res) {
    serverOps.getData(function (result) {
        return res.json(result);
    });
});

app.listen(PORT, function () {
    console.log("Live at Port 3000");
});
