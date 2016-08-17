module.exports = function (router, path) {
    router.get("/admin", function (req, res) {
        res.sendFile(path + "/admin/admin.html");
    });




};