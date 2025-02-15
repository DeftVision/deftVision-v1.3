// documentController.js

const { v4: uuidv4 } = require("uuid");
const { S3Client, GetObjectCommand, DeleteObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

require("dotenv").config();
const documentModel = require("../models/documentModel");
const mime = require("mime-types"); // ✅ Import MIME detection package

// ✅ Initialize S3 Client
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

// ✅ Generate a Presigned URL for S3 File Download


exports.getPresignedUrl = async (req, res) => {
    try {
        const { fileKey } = req.body;
        const bucketName = process.env.AWS_S3_BUCKET_NAME;

        if (!bucketName) {
            console.error("❌ AWS_S3_BUCKET_NAME is missing from environment variables!");
            return res.status(500).json({ message: "Server error: Missing bucket name in .env" });
        }

        if (!fileKey) {
            return res.status(400).json({ message: "Missing fileKey" });
        }

        console.log(`📂 Generating Signed URL for: ${fileKey} in Bucket: ${bucketName}`);

        // ✅ Dynamically set MIME type based on file extension
        const fileMimeType = mime.lookup(fileKey) || "application/octet-stream";

        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: fileKey,
            ResponseContentDisposition: "inline", // ✅ Allows the browser to display the file
            ResponseContentType: fileMimeType, // ✅ Sets correct MIME type
        });

        const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 600 });

        res.json({ presignedUrl });
    } catch (error) {
        console.error("❌ Error generating signed URL:", error);
        res.status(500).json({ message: "Error generating signed URL", error: error.message });
    }
};



exports.getPresignedUploadUrl = async (req, res) => {
    try {
        const { fileName, fileType } = req.body;
        const bucketName = process.env.AWS_S3_BUCKET_NAME;

        if (!fileName || !fileType) {
            console.error("❌ Missing file name or file type");
            return res.status(400).json({ message: "Missing file name or file type" });
        }

        if (!bucketName) {
            console.error("❌ Missing AWS_S3_BUCKET_NAME in environment variables!");
            return res.status(500).json({ message: "Server error: Missing S3 bucket name in .env" });
        }

        const fileKey = `uploads/${fileName}`;

        console.log(`📂 Generating presigned upload URL for: ${fileKey}`);

        // 🔥 Debugging Step: Log Expires Value Before Generating URL
        const expiresIn = 600; // 10 minutes
        console.log("🔍 Expires in:", expiresIn, typeof expiresIn); // <-- Log the value and type

        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: fileKey,
            ContentType: fileType,
        });

        const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn });

        res.json({ presignedUrl, fileKey });

    } catch (error) {
        console.error("❌ Error generating presigned upload URL:", error);
        res.status(500).json({ message: "Error generating presigned upload URL", error: error.message });
    }
};



// ✅ Save Document Metadata
exports.saveDocumentMetadata = async (req, res) => {
    try {
        const { title, category, fileKey, uploadedBy, isPublished } = req.body;

        if (!title || !category || !fileKey || !uploadedBy) {
            return res.status(400).json({ message: "Required fields are missing" });
        }

        const correctedFileKey = fileKey.startsWith("uploads/") ? fileKey : `uploads/${fileKey}`;

        const newDocument = new documentModel({
            title,
            category,
            fileKey: correctedFileKey,
            downloadUrl: `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${correctedFileKey}`,
            uploadedBy,
            isPublished: isPublished || false,
        });

        await newDocument.save();
        res.status(201).json({ message: "✅ Document saved successfully", document: newDocument });
    } catch (error) {
        console.error("❌ Error saving document metadata:", error);
        res.status(500).json({ message: "Error saving document metadata", error: error.message });
    }
};

// ✅ Fetch All Documents
exports.getAllDocuments = async (req, res) => {
    try {
        const documents = await documentModel.find({});
        res.json({ documents });
    } catch (error) {
        res.status(500).json({ message: "Error fetching documents", error: error.message });
    }
};

// ✅ Fetch a Single Document by ID
exports.getDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await documentModel.findById(id);
        if (!document) return res.status(404).json({ message: "Document not found" });
        res.status(200).json({ document });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving document", error: error.message });
    }
};

// ✅ Fetch Published Documents
exports.getPublishedDocuments = async (req, res) => {
    try {
        const documents = await documentModel.find({ isPublished: true });
        res.status(200).json({ documents });
    } catch (error) {
        res.status(500).json({ message: "Error fetching published documents", error: error.message });
    }
};

// ✅ Delete a Document (Including S3 File)
exports.deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the document in MongoDB
        const document = await documentModel.findById(id);
        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }

        // ✅ Delete from S3 if file exists
        if (document.fileKey) {
            const deleteParams = new DeleteObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: document.fileKey,
            });

            try {
                await s3Client.send(deleteParams);
                console.log(`🗑️ Successfully deleted from S3: ${document.fileKey}`);
            } catch (s3Error) {
                console.error("❌ S3 Deletion Error:", s3Error);
                return res.status(500).json({ message: "S3 deletion failed", error: s3Error.message });
            }
        }

        // ✅ Delete from MongoDB
        await documentModel.findByIdAndDelete(id);
        res.status(200).json({ message: "✅ Document deleted successfully" });

    } catch (error) {
        console.error("❌ Server Error:", error);
        return res.status(500).json({ message: "Server error deleting document", error: error.message });
    }
};

// ✅ Update an Existing Document
exports.updateDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, category, isPublished, uploadedBy } = req.body;
        const document = await documentModel.findById(id);
        if (!document) return res.status(404).json({ message: "Document not found" });

        document.title = title;
        document.category = category;
        document.isPublished = isPublished;
        document.uploadedBy = uploadedBy;
        await document.save();

        res.status(200).json({ message: "✅ Document updated successfully", document });
    } catch (error) {
        res.status(500).json({ message: "Error updating document", error: error.message });
    }
};
