const express = require('express');
const router = express.Router();

const { deleteAnnouncement, getAnnouncement, getAnnouncements, newAnnouncement, updateAnnouncement  } = require('../controllers/announcementController');

router.get('/', getAnnouncements);
router.get('/:id', getAnnouncement);

router.patch('/:id', updateAnnouncement);
router.delete('/:id', deleteAnnouncement);

router.post('/', newAnnouncement);


module.exports = router;