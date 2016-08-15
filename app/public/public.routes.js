module.exports = function (router, path) {
    var publicGAPI = require(path + "/public/public.google.api.js");

    router.get("/", function (req, res) {
        res.sendFile("index.html");
    });

    router.get("/publicGet", function (req, res) {
        publicGAPI.PubGetData(callback);

        function callback(data) {
            return res.json(data);
        }
    });


};