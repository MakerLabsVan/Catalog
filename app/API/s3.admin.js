var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var s3bucket = process.env.S3_BUCKET || 'makerlabs.catalog';
var compressed = "compressed/";

exports.upload = function (req, res, callback) {
    // get data from URI
    const fileName = req.query['file-name'];
    const fileType = req.query['file-type'];
    const folder = req.query['folder'];
    // create destination path
    const key = compressed + folder + "/" + fileName;
    // create parameter object
    const s3Params = {
        Bucket: s3bucket,
        Key: key,
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