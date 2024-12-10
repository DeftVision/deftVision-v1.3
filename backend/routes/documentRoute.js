const express = require('express');
const router = express.Router();

const { getDocuments, deleteDocument, getDocument, newDocument, updateDocument, toggleDocumentStatus } = require('../controllers/documentController')

router.get('/', getDocuments)
router.get('/:id', getDocument)
router.post('/', newDocument)
router.patch('/:id', updateDocument)
router.delete('/:id', deleteDocument)
router.patch('/status/:id', toggleDocumentStatus)

module.exports = router;