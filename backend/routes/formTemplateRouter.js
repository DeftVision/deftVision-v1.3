const express = require('express');
const router = express.Router();

const { saveFormTemplate, getFormTemplates } = require('../controllers/formTemplateController');

router.post('/', saveFormTemplate);
router.get('/', getFormTemplates);

module.exports = router;