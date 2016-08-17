var AWS = require('aws-sdk');
const s3 = new AWS.S3();
// AWS.config.loadFromPath('./aws.json');
const s3bucket = process.env.S3_BUCKET || 'makerlabs.catalog';
const compressed = "compressed/";

exports.getUrl = function (key, callback) {
    // key is bucket + file name
    var params = {
        Bucket: s3bucket,
        Key: String(compressed + key)
    };

    callback(s3.getSignedUrl('getObject', params));
};

exports.upload = function (req, res, callback) {
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const s3Params = {
        Bucket: s3bucket,
        Key: fileName,
        Expires: 60,
        ContentType: fileType,
        ACL: 'public-read'
    };

    s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if (err) {
            callback(err);
            console.log(err);
            return res.end();
        }
        const returnData = {
            signedRequest: data,
            url: `https://${s3bucket}.s3.amazonaws.com/${fileName}`
        };
        callback(returnData);
        res.write(JSON.stringify(returnData));
        res.end();
    });
};

