var path = __dirname;
var PORT = process.env.PORT || 3000;
var gapi = require(path + "/static/app/components/googlesheets/googlesheetsapi.js");

var getData = function (fn) {
    gapi.auth(gapi.listMajors, function (result) {
        fn(result);
    });
};

var parse = function (req, row) {
    // row is the length from data + 2
    var stdData = {
        "majorDimension": "ROWS",
        "values": [
            [req.body.Name, req.body.Type, req.body.LocX, req.body.LocY, req.body.Floor, req.body.DimW, req.body.DimL, req.body.DimH, req.body.DimU, req.body.Weight, req.body.WUnit, req.body.Qty, req.body.Price]
        ]
    }
    console.log(stdData);
    gapi.auth(gapi.sheetWrite, stdData, row);
};

var delEntry = function (index) {
    gapi.auth(gapi.deleteEntry, index);
}

exports.getData = getData;
exports.parse = parse;
exports.delEntry = delEntry;