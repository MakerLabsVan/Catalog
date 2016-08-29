module.exports = function (router, path) {
    var gapiPublic = require(path + "/API/google.public.js");
    var gapiAdmin = require(path + "/API/google.admin.js");
    var s3 = require(path + "/API/s3.public.js");
    var oauth = require(path + "/API/oauth.admin.js");
    var auth = oauth.OAuth2Client;

    // Dashboard
    router.get("/", sendDashboard);
    router.get("/site", sendMakerSite);
    router.get("/signin", sendSignin);
    router.get("/public", sendCatalog);

    router.get("/admin", sendAdmin);

    // data requests
    router.get("/publicGet", publicGet);
    router.post("/image", image);
    // oauth2
    router.get("/authCode", authCode);
    router.post("/sendCode", sendCode);
    // gapi
    router.post("/newEntry", newEntry);

    // parse post data to send to google api
    var parse = parse;

    ////////////////////////////
    function sendDashboard(req, res) {
        res.sendFile(path + "/dashboard/dashboard.html");
    }

    function sendMakerSite(req, res) {
        res.sendFile(path + "/makersite/makersite.html");
    }

    function sendSignin(req, res) {
        res.sendFile(path + "/signin/signin.html");
    }

    function sendCatalog(req, res) {
        res.sendFile(path + "/public/public.html");
    }

    function sendAdmin(req, res) {
        res.sendFile(path + "/admin/admin.html");
    }

    function publicGet(req, res) {
        gapiPublic.PubGetData(callback);

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
        oauth.getNewToken(auth, req.body[0], function (result) {
            return res.json(result);
        })
    }

    function newEntry(req, res) {
        console.log(req.body[0]);
        return res.json({"Recieved": "Recieved"});
    }

    function parse(values, row, callback) {
        var body = {
            stdData: {
                "majorDimension": "ROWS",
                "values": [values]
            },
            row: row
        };

        gapiAdmin.sheetWrite(auth, body, function (result) {
            callback(result);
        });
    }
};
