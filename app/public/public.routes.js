module.exports = function (router, path) {
    router.get("/", function (req, res){
        res.sendFile("index.html");
    });

    router.get("/Hello", function (req, res){
        res.send("Hello World");
    })
};