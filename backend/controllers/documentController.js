const { v4: uuidv4 } = require("uuid");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const documentModel = require("../models/documentModel");
require("dotenv").config();
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// ✅ Generate Pre-Signed URL for Direct Uploads
exports.getPresignedUrl = async (req, res) => {
    try {
        const { fileName, fileType } = req.body;
        if (!fileName || !fileType) return res.status(400).json({ message: "Missing fileName or fileType" });

        const uniqueFileName = `uploads/${uuidv4()}_${fileName}`;
        const s3Params = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: uniqueFileName,
            ContentType: fileType,
        });

        const presignedUrl = await getSignedUrl(s3Client, s3Params, { expiresIn: 3600 });
        res.status(200).json({ presignedUrl, fileKey: uniqueFileName });
    } catch (error) {
        res.status(500).json({ message: "Error generating pre-signed URL", error: error.message });
    }
};

// ✅ Save Document Metadata
exports.saveDocumentMetadata = async (req, res) => {
    try {
        const { title, category, fileKey, uploadedBy, isPublished } = req.body;

        if (!title || !category || !fileKey || !uploadedBy) {
            return res.status(400).json({ message: "Required fields are missing" });
        }

        const uniqueFileName = fileKey.split('/').pop(); // Extracts just the filename

        const newDocument = new documentModel({
            title,
            category,
            fileKey,
            uniqueName: uniqueFileName, // ✅ Fix: Assign uniqueName
            downloadUrl: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`,
            uploadedBy,
            isPublished: isPublished || false,
        });

        await newDocument.save();
        res.status(201).json({ message: "Document saved successfully", document: newDocument });
    } catch (error) {
        console.error("Error saving document metadata:", error);
        res.status(500).json({ message: "Error saving document metadata", error: error.message });
    }
};

// ✅ Fetch All Documents
exports.getAllDocuments = async (req, res) => {
    try {
        const documents = await documentModel.find({});
        res.json({ documents });
    } catch (error) {
        res.status(500).json({ message: "Error fetching documents" });
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

// ✅ Fetch Public Documents
exports.getPublicDocuments = async (req, res) => {
    try {
        const documents = await documentModel.find({ isPublished: true });
        res.status(200).json({ documents });
    } catch (error) {
        res.status(500).json({ message: "Error fetching public documents" });
    }
};

// ✅ Fetch All Documents (Correcting Missing Function)
exports.getDocuments = async (req, res) => {
    try {
        const documents = await documentModel.find({});
        if (!documents.length) return res.status(404).json({ message: "No documents found" });
        res.status(200).json({ documentCount: documents.length, documents });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving documents", error: error.message });
    }
};

// ✅ Create a New Document (Correcting Missing Function)
exports.newDocument = async (req, res) => {
    try {
        const { title, category, uploadedBy, isPublished, fileKey } = req.body;
        if (!title || !category || !uploadedBy || !fileKey) return res.status(400).json({ message: "Missing required fields" });

        const newDocument = new documentModel({
            title,
            category,
            fileKey,
            downloadUrl: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`,
            uploadedBy,
            isPublished: isPublished || false,
        });

        await newDocument.save();
        res.status(201).json({ message: "Document created successfully", document: newDocument });
    } catch (error) {
        res.status(500).json({ message: "Error creating document", error: error.message });
    }
};

// ✅ Delete a Document
exports.deleteDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const document = await documentModel.findById(id);

        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }

        if (document.uniqueName) {
            const deleteParams = new DeleteObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: document.uniqueName,
            });

            try {
                await s3Client.send(deleteParams);
                console.log(`🗑️ Successfully deleted from S3: ${document.uniqueName}`);
            } catch (s3Error) {
                console.error("❌ S3 Deletion Error:", s3Error);
                return res.status(500).json({ message: "S3 deletion failed", error: s3Error.message });
            }
        }

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

        res.status(200).json({ message: "Document updated successfully", document });
    } catch (error) {
        res.status(500).json({ message: "Error updating document", error: error.message });
    }
};
