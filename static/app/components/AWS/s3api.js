var AWS = require('aws-sdk');
// AWS.config.loadFromPath('./aws.json');
var s3bucket = process.env.S3_BUCKET || 'makerlabs.catalog';


//Used for embedded image on main page
exports.getS3URI = function (payload, callback) {
    var s3 = new AWS.S3();
    var params = {
        Bucket: s3bucket,
        Key: payload
    };
    s3.getSignedUrl('getObject', params, function (err, url) {
        callback(err, url);
    })
};

//Used for input page
exports.deleteImg = function (payload, callback) {

};

//Used for input page
exports.uploadFile = function (payload, callback) {

};

//Used for input page
exports.updateFile = function (payload, callback) {

};
