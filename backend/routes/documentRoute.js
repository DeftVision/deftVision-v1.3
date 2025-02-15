
const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
    getPresignedUrl,
    getPresignedUploadUrl,
    saveDocumentMetadata,
    getAllDocuments,
    getPublishedDocuments,
    getDocument,
    updateDocument,
    deleteDocument
} = require("../controllers/documentController"); // ✅ Ensure correct path

// 🎯 Multer Configuration for File Uploads (Memory Storage)
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "application/pdf",
            "text/plain",
            "video/mp4",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation"
        ];
        cb(null, allowedTypes.includes(file.mimetype));
    },
});

// ✅ File Upload & Pre-Signed URL Routes
router.post("/get-signed-url", getPresignedUrl); // 🎯 Fetch Presigned URL for Download
router.get("/get-signed-url", getPresignedUrl);  // 🎯 GET Support for Presigned URL

router.post("/presigned-url", getPresignedUploadUrl); // 🎯 Fetch Presigned URL for Uploads

// ✅ Missing Metadata Route (Added this line)
router.post("/metadata", saveDocumentMetadata);

// ✅ File Upload via Multer (Uses Metadata Route)
router.post("/upload", upload.single("file"), saveDocumentMetadata);

// ✅ Document Retrieval Routes
router.get("/", getAllDocuments);
router.get("/published", getPublishedDocuments);
router.get("/:id", getDocument);

// ✅ Document Update & Deletion Routes
router.patch("/:id", updateDocument);
router.delete("/:id", deleteDocument);

module.exports = router;
