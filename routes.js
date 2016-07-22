module.exports = function (router, path, serverOps, public_serverOps) {

    router.get("/", function (req, res) {
        res.sendFile(path + '/static/views/index.html');
        console.log()
    });

    router.get('/authCode', function (req, res) {
        serverOps.sendUrl(function (result) {
            return res.json(result);
        });
    });

    router.post('/sendCode', function (req, res) {
        console.log("routes : " + req.body[0]);
        serverOps.getCode(req.body[0], function(result){
            return res.json(result);
        })
    });

    router.get("/input", function (req, res) {
        res.sendFile(path + '/static/views/input.html');
    });

    router.post("/new", function (req, res) {
        serverOps.parse(req.body[0], req.body[1], function (response) {
            return res.json(response);
        });
    });

    router.post("/delete", function (req, res) {
        serverOps.delEntry(req.body[0], function (result) {
            return res.json(result);
        });
    });

    router.get("/getCatalog", function (req, res) {
        serverOps.getData(function (result) {
            return res.json(result);
        });
    });

    router.get("/publicGetCatalog", function (req, res) {
        public_serverOps.public_getDataList(function (result) {
            return res.json(result);
        });
    });
};

