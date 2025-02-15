// /scripts/generateSignedUrl.js
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const dotenv = require("dotenv");


// Load environment variables
dotenv.config();

// AWS Configuration
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Get file key from command-line arguments
const fileKey = process.argv[2];

if (!fileKey) {
    console.error("❌ Error: No file key provided. Usage: node generateSignedUrl.js <file-key>");
    process.exit(1);
}

// Generate Signed URL
const generateSignedUrl = async () => {
    try {
        console.log(`🟢 Generating signed URL for: ${fileKey}`);

        const command = new GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileKey,
        });

        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 });

        console.log(`✅ Signed URL: ${signedUrl}`);
    } catch (error) {
        console.error("❌ Error generating signed URL:", error);
    }
};

generateSignedUrl();
