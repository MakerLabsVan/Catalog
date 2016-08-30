var sheetKeyPrivate = process.env["SHEET"] || "1MJpC2n-ekpnRXaLsb7B4dI6VOQIzn1eZO61I7sy2yiA";

var google = require('googleapis');

var sheetWrite = function (auth, body, resCallback) {
    var nextRow = 'A' + String(body.row);
    console.log(nextRow);

    var sheets = google.sheets('v4');
    sheets.spreadsheets.values.update({
        auth: auth,
        spreadsheetId: sheetKeyPrivate,
        range: nextRow,
        valueInputOption: "USER_ENTERED",
        resource: body.stdData,
    }, function (err, response) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(response);
        resCallback(response);
    });
};

var deleteEntry = function (auth, row, resCallback) {
    console.log(row[0]);
    var body = {
        "requests": [
            {
                "deleteDimension": {
                    "range": {
                        "sheetId": 0,
                        "dimension": "ROWS",
                        "startIndex": row[0],
                        "endIndex": row[0] + 1
                    }
                }
            }
        ]
    };

    var sheets = google.sheets('v4');
    sheets.spreadsheets.batchUpdate({
        auth: auth,
        spreadsheetId: sheetKeyPrivate,
        resource: body
    }, function (err, response) {
        if (err) {
            console.log(err);
            return;
        }
        resCallback(response);
    })
};

exports.deleteEntry = deleteEntry;
exports.sheetWrite = sheetWrite;
