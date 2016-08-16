var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var s3bucket = process.env.S3_BUCKET || 'makerlabs.catalog';
var compressed = "compressed/";

var service = {
    listBucket: listBucket,
    listBucketObjects: listBucketObjects,
    getUrl: getUrl
};

////////////////////////////////////////
function listBucket(callback) {
    s3.listBuckets(function (err, data) {
        callback(err, data);
    });
}

function listBucketObjects(callback) {
    var params = {
        Bucket: s3bucket
    };

    s3.listObjects(params, function (err, data) {
        callback(err, data);
    })
}

function getUrl(key, callback) {
    // key is bucket + file name
    var params = {
        Bucket: s3bucket,
        Key: String(compressed + key)
    };

    callback(s3.getSignedUrl('getObject', params));
}

exports.service = service;
