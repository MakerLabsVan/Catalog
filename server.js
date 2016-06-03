var path = __dirname;
var gapi = require(path + '/app/components/googlesheets/googlesheetsapi.js');
var express = require('express');
var app = express();
var router = express.Router();

app.use("/", router);
app.use(express.static(path));

router.get("/", function (req, res) {
    res.sendFile(path + '/index.html');
    gapi.auth(gapi.listMajors);
});

app.listen(3000, function () {
    console.log("Live at Port 3000");
});
