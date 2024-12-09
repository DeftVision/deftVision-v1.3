const express = require('express');
const router = express.Router();

const { getDocuments, deleteDocument, getDocument, newDocument, updateDocument } = require('../controllers/documentController')

router.get('/', getDocuments)
router.get('/:id', getDocument)
router.post('/', newDocument)
router.patch('/:id', updateDocument)
router.delete('/:id', deleteDocument)

module.exports = router;