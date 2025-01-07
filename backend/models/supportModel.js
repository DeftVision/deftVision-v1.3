const mongoose = require('mongoose');
const supportSchema = new mongoose.Schema({
    dateTime: {
        type: Date,
        default: Date.now
    },
    location: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    ticketStatus: {
            type: String,
            required: true,
            default: 'Open'
        },
    urgency: {
        type: String,
        required: true,
        default: ''
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isArchived: {
        type: Boolean,
        required: false,
        default: false
    }
}, { timestamps: true });

const supportModel = mongoose.model('Support', supportSchema);
module.exports = supportModel;