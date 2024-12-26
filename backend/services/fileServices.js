// Root: backend/services/fileService.js
const s3 = require('../config/s3');

exports.deleteFileFromS3 = async (url) => {
    const Key = url.split('/').pop();
    return s3
        .deleteObject({
            Bucket: process.env.S3_BUCKET_NAME,
            Key,
        })
        .promise();
};

exports.uploadFileToS3 = async (file) => {
    const Key = `${uuidv4()}-${file.originalname}`;
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
    };
    const response = await s3.upload(params).promise();
    return response.Location;
};
