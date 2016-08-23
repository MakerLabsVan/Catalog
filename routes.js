module.exports = function (router, path) {
    var gapi = require(path + "/API/google.public.js");
    var s3 = require(path + "/API/s3.public.js");
    var oauth = require(path + "/API/oauth.admin.js");

    router.get("/", sendHome);
    router.get("/publicGet", publicGet);
    router.get("/admin", sendAdmin);
    router.post("/image", image);

    // oauth2
    router.get("/authCode", authCode);
    router.post("/sendCode", sendCode);


    ////////////////////////////
    function sendHome(req, res) {
        res.sendFile(path + "/public/public.html");
    }

    function sendAdmin(req, res) {
        res.sendFile(path + "/admin/admin.html");
    }

    function publicGet(req, res) {
        gapi.PubGetData(callback);

        ////////////////////////////////////////
        function callback(data) {
            return res.json(data);
        }
    }

    function image(req, res) {
        s3.service.getUrl(req.body[0], function (url) {
            console.log(req.body[0]);
            console.log("Url: " + url);
            return res.json(url);
        })
    }

    function authCode(req, res) {
        oauth.sendUrl(function (result) {
            return res.json(result);
        })
    }

    function sendCode(req, res) {
        oauth.getNewToken(oauth.OAuth2Client, req.body[0], function (result) {
            return res.json(result);
        })
    }
};