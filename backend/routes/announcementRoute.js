const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')

const {
    deleteAnnouncement,
    getAnnouncement,
    getAnnouncements,
    newAnnouncement,
    updateAnnouncement,
    togglePublishStatus,
    getAnnouncementsByAudience
} = require('../controllers/announcementController');

router.get('/', getAnnouncements);
router.get('/audience', authMiddleware, getAnnouncementsByAudience);
router.get('/:id', getAnnouncement);

router.patch('/:id', updateAnnouncement);
router.delete('/:id', deleteAnnouncement);

router.post('/', newAnnouncement);

router.patch('/status/:id', togglePublishStatus)


module.exports = router;