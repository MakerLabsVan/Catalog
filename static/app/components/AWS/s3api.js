var AWS = require('aws-sdk');
var s3 = new AWS.S3();
// AWS.config.loadFromPath('./aws.json');
var s3bucket = process.env.S3_BUCKET || 'makerlabs.catalog';
var compressed = "compressed/";

//TODO: export members on top REMAKE!!!!!
exports.listBucket = function (callback) {
    s3.listBuckets(function (err, data) {
        callback(err, data);
    })
};

exports.listBucketObjects = function (callback) {
    var params = {
        Bucket: s3bucket
    };

    s3.listObjects(params, function (err, data) {
        callback(err, data);
    })
};

exports.getUrl = function (key, callback) {
    // key is bucket + file name
    var params = {
        Bucket: s3bucket,
        Key: String(compressed + key)
    };

    callback(s3.getSignedUrl('getObject', params));
};

