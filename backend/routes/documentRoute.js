const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getDocumentsByAudience, getDocuments, deleteDocument, getDocument, newDocument, updateDocument, toggleDocumentStatus } = require('../controllers/documentController')
const authMiddleware = require('../middleware/authMiddleware')


const storage = multer.memoryStorage();
const upload = multer ({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'image/jpeg',
            'image/jpg',
            'application/pdf',
            'text/plain',
            'video/mp4',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ]
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Unsupported file type'));
        }
    },
});

router.get('/', getDocuments)
router.get('/audience', authMiddleware, getDocumentsByAudience)
router.get('/:id', getDocument)
router.post('/', upload.single('file'), newDocument)
router.patch('/:id', updateDocument)
router.delete('/:id', deleteDocument)
router.patch('/status/:id', toggleDocumentStatus)

module.exports = router;