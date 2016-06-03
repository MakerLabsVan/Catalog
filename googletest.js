var google =require('googleapis');

var sheets = google.sheets('v4');
sheets.spreadsheets.values.get({
    spreadsheetId: ''1MJpC2n-ekpnRXaLsb7B4dI6VOQIzn1eZO61I7sy2yiA
    range: 'Class Data!A2:E'
}, function( err, response){
  if (err) {
    console.log('The API returned an error: ' + err);
    return;
  }
  var rows = response.values;
  if (rows.length == 0) {
    console.log('No data found.');
  } else {
    console.log('Name, Major:');
    for (var i = 0; i < rows.length; i++) {
      var row = rows[i];
      // Print columns A and E, which correspond to indices 0 and 4.
      console.log('%s, %s', row[0], row[4]);
    }
  }
});
