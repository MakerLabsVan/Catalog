var googleAuth = require('google-auth-library');
var auth = new googleAuth();
var fs = require('fs');

// set client information
var clientId = '656449394957-h1hmtinqs9mrd2rn11ef6jal6gdb300r.apps.googleusercontent.com';
var clientSecret = 'AihJh0QO2Hx4aekcvS32Ekk6';
var redirectUrl = 'urn:ietf:wg:oauth:2.0:oob';

var OAuth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'sheets.makerlabs.json';

// init oauth2 client with client information

// get redirect url for auth code
var url = OAuth2Client.generateAuthUrl({
    access_type: 'offline', // will return a refresh token
    scope: SCOPES
});

// callback to send code to server
var sendUrl = function (callback) {
    callback(url);
};

var checkForToken = function (callback) {
    fs.readFile(TOKEN_PATH, function (err, token) {
        if (err) {
            callback(err);
        } else {
            OAuth2Client.credentials = JSON.parse(token);
            callback(token);
        }
    })
};

var getNewToken = function (OAuth2Client, code, callback) {

    OAuth2Client.getToken(code, function (err, newToken) {
        if (err) {
            console.log("getNewToken fn: " + err);
            return;
        }
        OAuth2Client.credentials = newToken;
        callback("oauth2login: " + newToken);
        storeToken(newToken);
    });

    // fs.readFile(TOKEN_PATH, function (err, token) {
    //     if (err) {
    //         OAuth2Client.getToken(code, function (err, newToken) {
    //             if (err) {
    //                 console.log("getNewToken fn: " + err);
    //                 return;
    //             }
    //             OAuth2Client.credentials = newToken;
    //             callback("oauth2login: " + newToken);
    //             storeToken(newToken);
    //         })
    //     } else {
    //         OAuth2Client.credentials = token;
    //         storeToken(token);
    //         callback(token);
    //     }
    // })
};

var storeToken = function (token) {
    try {
        fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
        if (err.code != 'EEXIST') {
            throw err;
        }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token));
    console.log('Token stored to ' + TOKEN_PATH);
};

module.exports = {
    OAuth2Client: OAuth2Client,
    sendUrl: sendUrl,
    getNewToken: getNewToken,
    checkForToken: checkForToken
};