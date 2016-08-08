module.exports = function (router, path) {
    var publicGAPI = require(path + "/public/public.google.api.js");

    router.get("/", function (req, res) {
        res.sendFile("index.html");
    });

    router.get("/Hello", function (req, res) {
        res.send("Hello World");
    });

    router.get("/publicGet", function (req, res) {
        publicGAPI.PubGetData(function (data) {
            return res.json(data);
        })
    })
};