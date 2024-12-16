const express = require('express');
const multer = require('multer');
const router = express.Router();


const { deleteShopper, getShopper, getShoppers, newShopper, updateShopper, shopperScores} = require('../controllers/shopperController');

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
        if(allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Unsupported file type'));
        }
    }
})


router.get('/scores', shopperScores);
router.get('/', getShoppers);
router.get('/:id', getShopper);
router.post('/', upload.single('image'), newShopper);
router.patch('/:id', updateShopper);
router.delete('/:id', deleteShopper);

module.exports = router;