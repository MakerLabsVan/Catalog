const PORT = 3000;
var path = __dirname;
var gapi = require(path + '/googlesheetsapi.js');
var express = require('express');
var app = express();
var router = express.Router();

app.use("/", router);
app.use(express.static(path));

router.get("/", function (req, res) {
    res.sendFile(path + '/index.html');
    gapi.auth(gapi.listMajors);
});

app.listen(PORT, function () {
    console.log("Live at Port" + PORT);
});
