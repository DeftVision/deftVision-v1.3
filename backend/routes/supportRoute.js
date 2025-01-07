const express = require('express');
const router = express.Router();

const {
    getUserTickets,
    getSupportTicket,
    newSupportTicket,
    updateSupportTicket,
    deleteSupportTicket,
} = require('../controllers/supportController');
const authMiddleware = require('../middleware/authMiddleware');

// Add specific routes first
router.get('/user-tickets', authMiddleware, getUserTickets);
router.post('/', authMiddleware, newSupportTicket);
router.get('/:id', authMiddleware, getSupportTicket);
router.patch('/:id', authMiddleware, updateSupportTicket);
router.delete('/:id', authMiddleware, deleteSupportTicket);

module.exports = router;
