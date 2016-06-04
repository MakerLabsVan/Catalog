var path = __dirname;
var express = require('express');
var app = express();
var router = express.Router();
var gapi = require(path + "/app/components/googlesheets/googlesheetsapi.js");

app.use("/", router);
app.use(express.static(path));

function res(result) {
    var test = result;
    console.log(test[15][0]);
}

gapi.auth(gapi.listMajors, function(result){
    res(result);
});

app.get("/", function (req, res) {
    res.sendFile(path + '/views/index.html');
});

app.listen(3000, function () {
    console.log("Live at Port 3000");
});
