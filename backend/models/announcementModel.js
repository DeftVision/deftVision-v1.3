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
        type: [String],
        required: true,
        default: [], // Default to an empty array
        validate: {
            validator: function (value) {
                return Array.isArray(value) && value.length > 0;
            },
            message: "Audience must be a non-empty array of strings",
        },
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
}, {timestamps: true});

const announcementModel = mongoose.model('Announcement', announcementSchema);
module.exports = announcementModel;