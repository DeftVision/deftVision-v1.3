const express = require('express');
const router = express.Router();

const {
    getUserTickets,
    getSupportTicket,
    getSupportTickets,
    newSupportTicket,
    updateSupportTicket,
    deleteSupportTicket,
} = require('../controllers/supportController');
const authMiddleware = require('../middleware/authMiddleware');

// Add specific routes first
router.get('/user-tickets', authMiddleware, getUserTickets);
router.get('/:id', authMiddleware, getSupportTicket);
router.patch('/:id', authMiddleware, updateSupportTicket);
router.delete('/:id', authMiddleware, deleteSupportTicket);
router.post('/', authMiddleware, newSupportTicket);
router.get('/', authMiddleware, getSupportTickets);

module.exports = router;
