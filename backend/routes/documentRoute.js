const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
    getDocuments,
    getPublicDocuments,
    getAllDocuments,
    getDocument,
    newDocument,
    getPresignedUrl,
    updateDocument,
    deleteDocument,
    saveDocumentMetadata,
} = require('../controllers/documentController');

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'application/pdf',
            'text/plain',
            'video/mp4',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ];
        cb(null, allowedTypes.includes(file.mimetype));
    },
});

// Routes
router.get('/', getDocuments);
router.get('/public', getPublicDocuments);
router.get('/view-docs', getAllDocuments);
router.get('/:id', getDocument);
router.post('/presigned-url', getPresignedUrl);
router.post('/', upload.single('file'), newDocument);
router.patch('/:id', updateDocument);
router.delete('/:id', deleteDocument);
router.post('/metadata', saveDocumentMetadata);

module.exports = router;
