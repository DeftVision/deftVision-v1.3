const mongoose = require("mongoose");
const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: false,
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    fileKey: {
        type: String,
        required: true,
    },
    downloadUrl: {
        type: String,
        required: true,
    },
    uploadedBy: {
        type: String,
        required: true,
    },
    isPublished: {
        type: Boolean,
        required: false
    },
    fileSize: {
        type: Number,
        required: false,
    },
    fileType: {
        type: String,
        required: false
    }
}, {timestamps: true})

const documentModel = mongoose.model('Document', documentSchema);
module.exports = documentModel;
