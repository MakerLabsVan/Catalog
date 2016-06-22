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
            [req.Name, req.Type, req.Subtype, req['Location x (ft)'], req['Location y (ft)'], req.Floor, req.Width, req.Length, req.Height, req.Units, req.Weight, req['Weight Unit'], req.Quantity, req.Price]
        ]
    }
    console.log(stdData);
    // gapi.auth(gapi.sheetWrite, stdData, row);
};

var delEntry = function (index) {
    gapi.auth(gapi.deleteEntry, index);
}

exports.getData = getData;
exports.parse = parse;
exports.delEntry = delEntry;