var path = __dirname;
var PORT = process.env.PORT || 3000;
var gapi = require(path + "/static/app/components/googlesheets/googlesheetsapi.js");

var getData = function (fn) {
    gapi.auth(gapi.listMajors, function (result) {
        fn(result);
    });
};

var parse = function (req, row) {
    var stdData = {
        "majorDimension": "ROWS",
        "values": [
            [req.body.Name, req.body.Type, req.body.Subtype, req.body['Location x (ft)'], req.body['Location y (ft)'], req.body.Floor, req.body.Width, req.body.Length, req.body.Height, req.body.Units, req.body.Weight, req.body['Weight Unit'], req.body.Quantity, req.body.Price]
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