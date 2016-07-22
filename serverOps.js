var path = __dirname;
var gapi = require(path + "/static/app/components/googlesheets/googlesheetsapi.js");
var oauth = require(path + '/static/app/components/googlesheets/oauth2login.js');

var sendUrl = function (callback) {
    oauth.sendUrl(function (result) {
        callback(result)
    });
};

var getData = function (fn) {
    gapi.auth(gapi.getDataList, function (result) {
        fn(result);
    });
};

var parse = function (req, row, res) {
    var body = {
        stdData: {
            "majorDimension": "ROWS",
            "values": [req]
        },
        row: row
    }
    gapi.auth(gapi.sheetWrite, body, function (result) {
        res(result);
    });
};

var delEntry = function (index, response) {
    gapi.auth(gapi.deleteEntry, index, function (res) {
        response(res);
    });
}

exports.getData = getData;
exports.parse = parse;
exports.delEntry = delEntry;
exports.sendUrl = sendUrl;