// /backend/scripts/uploadFile.js

require("dotenv").config();
const AWS = require("aws-sdk");
const fs = require("fs");

// ✅ Configure AWS SDK
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

/**
 * ✅ Upload a File to S3
 * @param {string} filePath - Local file path
 * @param {string} fileKey - Target file path in S3
 */
const uploadFile = async (filePath, fileKey) => {
    if (!fs.existsSync(filePath)) {
        console.error("❌ Error: File does not exist:", filePath);
        return;
    }

    const fileStream = fs.createReadStream(filePath);

    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileKey,
        Body: fileStream,
        ContentType: "application/octet-stream", // Change based on file type
    };

    try {
        const uploadResult = await s3.upload(params).promise();
        console.log("✅ File Uploaded Successfully:", uploadResult.Location);
    } catch (error) {
        console.error("❌ Error uploading file:", error);
    }
};

// ✅ Run the function with test parameters
const filePath = process.argv[2];
const fileKey = process.argv[3];
uploadFile(filePath, fileKey);
