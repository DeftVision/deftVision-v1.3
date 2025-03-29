const express = require('express');
const router = express.Router();
const roleMiddleware = require('../middleware/roleMiddleware')
const authMiddleware = require('../middleware/authMiddleware')

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
router.post('/', authMiddleware, newShopper);
router.get('/scores', shopperScores);
router.get('/', authMiddleware, roleMiddleware(['Admin', 'Shopper', 'User']), getShoppers);
router.get('/:id', getShopper);

router.patch('/:id', updateShopper);
router.delete('/:id', deleteShopper);

module.exports = router;