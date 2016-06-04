var path = __dirname;
var express = require('express');
var app = express();
var router = express.Router();
var gapi = require(path + "/app/components/googlesheets/googlesheetsapi.js");

app.use("/", router);
app.use(express.static(path));

function res(result) {
    var test = result;
    for (var i = 0; i < test.length; i++){
        for (var j = 0; j < test[i].length; j++){
            // console.log(test[i][j]);
        }
    }
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
