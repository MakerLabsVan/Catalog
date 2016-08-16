module.exports = function (router, path) {
    var gapi = require(path + "/API/google.public.js");
    var s3 = require(path + "/API/s3.public.js");

    router.get("/", function (req, res) {
        res.sendFile("index.html");
    });

    router.get("/publicGet", function (req, res) {
        gapi.PubGetData(callback);

        function callback(data) {
            return res.json(data);
        }
    });

    router.post("/image", function (req, res) {
        s3.service.getUrl(req.body[0], function (url) {
            console.log(req.body[0]);
            console.log("Url: " + url);
            return res.json(url);
        })
    })


};