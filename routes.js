module.exports = function (router, path, serverOps, public_serverOps, s3Ops) {

    router.get('/', function (req, res) {
        res.sendFile(path + '/static/views/index.html');
    });

    router.get('/signin', function (req, res) {
        res.sendFile(path + '/static/app/signin/signin.html');
    })

    router.get('/authCode', function (req, res) {
        serverOps.sendUrl(function (result) {
            return res.json(result);
        });
    });

    router.post('/sendCode', function (req, res) {
        console.log("routes : " + req.body[0]);
        serverOps.getCode(req.body[0], function (result) {
            return res.json(result);
        })
    });

    router.get("/input", function (req, res) {
        serverOps.checkForToken(function (result) {
        });
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

    router.get("/buckets", function (req, res) {
        s3Ops.listBucket(function (err, data) {
            if (err) {
                console.log(err);
                return res.json(err);
            } else {
                console.log(data);
                return res.json(data);
            }
        })
    });

    router.get("/bucketObjects", function (req, res) {
        s3Ops.listBucketObjects(function (err, data) {
            if (err) {
                console.log(err);
                return res.json(err);
            } else {
                console.log(data);
                return res.json(data.Contents);
            }
        })
    });

    router.post("/object", function (req, res) {
        s3Ops.getUrl(req.body[0], function (url) {
            console.log(req.body[0]);
            console.log("url" + url);
            return res.json(url);
        })
    });

    router.get('/sign-s3', function (req, res) {
        s3Ops.upload(req, res, function (response) {
            console.log(response);
        });
    });

    router.post("/put", function (req, res) {

    })
};
