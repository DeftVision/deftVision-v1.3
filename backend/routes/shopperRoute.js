const express = require('express');
const router = express.Router();

const { deleteShopper, getShopper, getShoppers, newShopper, updateShopper, shopperScores} = require('../controllers/shopperController');

router.get('/scores', shopperScores);
router.get('/', getShoppers);
router.get('/:id', getShopper);
router.post('/', newShopper);
router.patch('/:id', updateShopper);
router.delete('/:id', deleteShopper);

module.exports = router;