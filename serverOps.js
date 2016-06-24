var path = __dirname;
var PORT = process.env.PORT || 3000;
var gapi = require(path + "/static/app/components/googlesheets/googlesheetsapi.js");

var getData = function (fn) {
    gapi.auth(gapi.listMajors, function (result) {
        fn(result);
    });
};

var parse = function (req, row, res) {
    var body = {
        stdData: {
            "majorDimension": "ROWS",
            "values": [
                [req.Name, req.Type, req.Subtype, req['Location x (ft)'], req['Location y (ft)'], req.Floor, req.Width, req.Length, req.Height, req.Units, req.Weight, req['Weight Unit'], req.Quantity, req.Price, req.Keywords]
            ]
        },
        row: row
    }

    gapi.auth(gapi.sheetWrite, body, function(result){
        res(result);
    });
};

var delEntry = function (index, response) {
    gapi.auth(gapi.deleteEntry, index, function(res){
        response(res);
    });
}

exports.getData = getData;
exports.parse = parse;
exports.delEntry = delEntry;