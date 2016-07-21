var google = require('googleapis');
var readline = require('readline');
var fs = require('fs');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// create spreadsheets client
var sheets = google.sheets('v4');
// oauth2 client
var OAuth2 = google.auth.OAuth2;

// client information
var secretFile = 'makerlabs_client_secret.json';
var CLIENT_ID = '';
var CLIENT_SECRET = '';
var REDIRECT_URL = '';
var SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

// read from client secret
var setClientId = function (id, secret, redirect) {
    fs.readFile(secretFile, function parse(err, content) {
        if (err) {
            console.log("Error: " + err);
            return;
        }
        var secret = JSON.parse(content);
        id = secret.installed.client_id;
        secret = secret.installed.client_secret;
        redirect = secret.installed.redirect_urls[0];
    })
};

// instantiate OAuth2 client
var oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
// set global auth for one time auth
google.options({auth: oauth2Client});

var getAccessToken = function (oauth2Client, callback) {
    var url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });

    console.log('Visit this page: ' + url);
    rl.question('Enter the code here: ', function (code) {
        oauth2Client.getToken(code, function (err, tokens) {
            if (err) {
                console.log("Error: " + err);
            }
            oauth2Client.setCredentials(tokens);
            callback();
        });
    });
};

exports.setClientId = setClientId;
exports.getAccessToken = getAccessToken;

