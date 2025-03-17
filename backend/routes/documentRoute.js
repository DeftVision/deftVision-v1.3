const express = require("express");
const router = express.Router();
const {
    getPresignedUrl,
    getPresignedUploadUrl,
    saveDocumentMetadata,
    getAllDocuments,
    getPublishedDocuments,
    getDocument,
    updateDocument,
    deleteDocument
} = require("../controllers/documentController");

// Standardized Routes
router.post("/get-signed-url", getPresignedUrl); // Fetch Presigned URL for Download
router.post("/get-presigned-upload-url", getPresignedUploadUrl); // Standardized Upload Route

// Document Metadata and Upload
router.post("/metadata", saveDocumentMetadata);
router.post("/upload", saveDocumentMetadata);

// Document Retrieval Routes
router.get("/", getAllDocuments);
router.get("/published", getPublishedDocuments);
router.get("/:id", getDocument);

// Document Update & Deletion Routes
router.patch("/:id", updateDocument);
router.delete("/:id", deleteDocument);

// Debugging: Log Registered Routes
console.log(
    "Registered routes in documentRoute.js:",
    router.stack.map((r) => (r.route ? r.route.path : "MIDDLEWARE"))
);

module.exports = router;
