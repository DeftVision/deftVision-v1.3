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
    priorities: {
        type: String,
        required: true,
    },
    audiences: {
        type: String,
        required: true
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
}, {timestamps: true});

const announcementModel = mongoose.model('Announcement', announcementSchema);
module.exports = announcementModel;