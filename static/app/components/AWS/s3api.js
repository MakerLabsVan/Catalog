var AWS = require('aws-sdk');
AWS.config.loadFromPath('./aws.json');
var s3bucket = process.env.S3_BUCKET || 'makerlabs.catalog';

var params = {
  Bucket: s3bucket /* required */
};

var s3 = new AWS.S3();

//Used for embedded image on main page
exports.getS3URI = function(payload, callback){

}

//Used for input page
exports.deleteImg = function(payload, callback){

}

//Used for input page
exports.uploadFile = function(payload, callback){

}

//Used for input page
exports.updateFie = function(payload, callback){

}
