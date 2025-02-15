// /backend/scripts/deleteFile.js

require("dotenv").config();
const AWS = require("aws-sdk");

// ✅ Configure AWS SDK
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

/**
 * ✅ Delete a File from S3
 * @param {string} fileKey - The file key in S3 (e.g., "uploads/test.pdf")
 */
const deleteFile = async (fileKey) => {
    if (!fileKey) {
        console.error("❌ Error: No fileKey provided.");
        return;
    }

    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: fileKey,
    };

    try {
        await s3.deleteObject(params).promise();
        console.log(`✅ File Deleted Successfully: ${fileKey}`);
    } catch (error) {
        console.error("❌ Error deleting file:", error);
    }
};

// ✅ Run the function with test parameters
const fileKey = process.argv[2];
deleteFile(fileKey);
