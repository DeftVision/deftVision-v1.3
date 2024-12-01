const express = require('express');
const router = express.Router();

const { saveFormTemplate, getFormTemplates, getPublishedTemplates, deleteTemplate, updateTemplate } = require('../controllers/formTemplateController');

router.post('/', saveFormTemplate);
router.delete('/:id', deleteTemplate);
router.patch('/:id', updateTemplate);
router.get('/', getFormTemplates);
router.get('/published', getPublishedTemplates);

module.exports = router;