var google = require('googleapis');
// create spreadsheets client
var sheets = google.sheets('v4');
// oauth2 client
var OAuth2 = google.auth.OAuth2;

// client information
var CLIENT_ID = '';
var CLIENT_SECRET = '';
var REDIRECT_URL = '';
var SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

// instantiate OAuth2 client
var oauth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
var url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
});

