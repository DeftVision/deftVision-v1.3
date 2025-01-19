const express = require('express');
const router = express.Router();
const multer = require('multer');
const authMiddleware = require('../middleware/authMiddleware');
const {
    getDocumentsByAudience,
    getDocuments,
    deleteDocument,
    getDocument,
    newDocument,
    updateDocument,
    toggleDocumentStatus,
} = require('../controllers/documentController');

// Multer configuration for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'image/jpeg',
            'image/jpg',
            'application/pdf',
            'text/plain',
            'video/mp4',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Unsupported file type'));
        }
    },
});

// Routes
router.get('/', getDocuments); // Fetch all documents
router.get('/audience', authMiddleware, getDocumentsByAudience); // Fetch documents by audience with auth
router.get('/:id', getDocument); // Fetch a single document by ID
router.post('/', upload.single('file'), newDocument); // Upload a new document
//router.patch('/:id', documentController.updateDocument);// Update an existing document by ID
router.patch('/status/:id', toggleDocumentStatus); // Toggle document status by ID
router.delete('/:id', deleteDocument); // Delete a document by ID

// Export the router
module.exports = router;

