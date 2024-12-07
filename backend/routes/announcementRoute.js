const express = require('express');
const router = express.Router();

const { deleteAnnouncement, getAnnouncement, getAnnouncements, newAnnouncement, updateAnnouncement, togglePublishStatus } = require('../controllers/announcementController');

router.get('/', getAnnouncements);
router.get('/:id', getAnnouncement);

router.patch('/:id', updateAnnouncement);
router.delete('/:id', deleteAnnouncement);

router.post('/', newAnnouncement);

router.patch('/status/:id', togglePublishStatus)


module.exports = router;