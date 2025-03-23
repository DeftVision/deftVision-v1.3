const express = require('express');
const router = express.Router();

const {
    deleteShopper,
    getShopper,
    getShoppers,
    newShopper,
    updateShopper,
    shopperScores,
    getPresignedUploadUrl,
} = require('../controllers/shopperController');


router.post("/get-presigned-upload-url", getPresignedUploadUrl);
router.post('/', newShopper);
router.get('/scores', shopperScores);
router.get('/', getShoppers);
router.get('/:id', getShopper);

router.patch('/:id', updateShopper);
router.delete('/:id', deleteShopper);

module.exports = router;