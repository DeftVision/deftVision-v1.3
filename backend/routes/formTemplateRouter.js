const express = require('express');
const router = express.Router();

const { saveFormTemplate } = require('../controllers/formTemplateController');

router.post('/', saveFormTemplate);

module.exports = router;