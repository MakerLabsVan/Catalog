var path = __dirname;
var gapi = require(path + "/static/app/components/googlesheets/googlesheetsapi.js");
var oauth = require(path + '/static/app/components/googlesheets/oauth2login.js');
var auth = oauth.OAuth2Client;

var checkForToken = function (callback) {
    oauth.checkForToken(function (result) {
        callback(result);
    })
};

var sendUrl = function (callback) {
    oauth.sendUrl(function (result) {
        callback(result)
    });
};

var getCode = function (code, callback) {
    console.log("serverops: " + code);
    oauth.getNewToken(auth, code, function (result) {
        callback(result);
    })
};

var getData = function (fn) {
    gapi.getDataList(auth, function (result) {
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
    };

    gapi.sheetWrite(auth, body, function (result) {
        res(result);
    });

};

var delEntry = function (index, response) {
    gapi.deleteEntry(auth, index, function (result) {
        response(result);
    });
};

exports.getData = getData;
exports.parse = parse;
exports.delEntry = delEntry;
exports.sendUrl = sendUrl;
exports.getCode = getCode;
exports.checkForToken = checkForToken;