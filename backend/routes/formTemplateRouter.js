const express = require('express');
const router = express.Router();

const { saveFormTemplate, getFormTemplates, getPublishedTemplates } = require('../controllers/formTemplateController');

router.post('/', saveFormTemplate);
router.get('/', getFormTemplates);
router.get('/published', getPublishedTemplates);

module.exports = router;