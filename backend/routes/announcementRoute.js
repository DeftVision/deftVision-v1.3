const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware')

const { deleteAnnouncement, getAnnouncement, getAnnouncements, newAnnouncement, updateAnnouncement, togglePublishStatus, getAnnouncementForAudience } = require('../controllers/announcementController');

router.get('/', getAnnouncements);
router.get('/:id', getAnnouncement);

router.patch('/:id', updateAnnouncement);
router.delete('/:id', deleteAnnouncement);

router.post('/', newAnnouncement);

router.patch('/status/:id', togglePublishStatus)
router.get('/audience', authMiddleware, getAnnouncementForAudience);

module.exports = router;