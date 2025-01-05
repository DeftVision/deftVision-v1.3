const express = require('express');
const router = express.Router();

const { getSupportTickets, getSupportTicket, newSupportTicket, updateSupportTicket, deleteSupportTicket } = require('../controllers/supportController')


router.get('/:id', getSupportTicket)
router.patch('/:id', updateSupportTicket)
router.delete('/:id', deleteSupportTicket)
router.get('/', getSupportTickets)
router.post('/', newSupportTicket)

module.exports = router;