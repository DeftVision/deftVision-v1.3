const mongoose = require('mongoose');
const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        required: true,
    },
    audience: {
        type: String,
        required: true
    },
    markedAsRead: {
      type: Boolean,
      default: false,
    }
}, {timestamps: true});

const announcementModel = mongoose.model('Announcement', announcementSchema);
module.exports = announcementModel;