const express = require('express');
const router = express.Router();

const { saveUserResponse, getUserResponse } = require('../controllers/userResponseController');

router.post('/', saveUserResponse);
router.get('/', getUserResponse);

module.exports = router;