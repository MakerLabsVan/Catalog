var gapi = require('googleapis');
var fs = require('fs');

// set client information
var oauth2 = gapi.auth.OAuth2;
var clientId = '656449394957-h1hmtinqs9mrd2rn11ef6jal6gdb300r.apps.googleusercontent.com';
var clientSecret = 'AihJh0QO2Hx4aekcvS32Ekk6';
var redirectUrl = 'urn:ietf:wg:oauth:2.0:oob';

// init oauth2 client with client information
var OAuth2Client = new oauth2(clientId, clientSecret, redirectUrl);

// get redirect url for auth code
var url = OAuth2Client.generateAuthUrl({
    access_type: 'offline', // will return a refresh token
    scope: 'https://www.googleapis.com/auth/plus.me' // can be a space-delimited string or an array of scopes
});

// callback to send code to server
var sendUrl = function (callback) {
    callback(url);
};

module.exports = {
    OAuth2Client: OAuth2Client,
    sendUrl: sendUrl
};