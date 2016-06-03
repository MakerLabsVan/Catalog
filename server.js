var express = require('express');
var path = __dirname;
var app = express();
var router = express.Router();

app.use("/", router);
app.use(express.static(path));

router.get("/", function (req, res) {
    res.sendFile(path + '/index.html');
});

app.listen(3000, function () {
    console.log("Live at Port 3000");
});
