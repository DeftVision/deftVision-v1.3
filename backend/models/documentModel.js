const mongoose = require("mongoose");
const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    uniqueName: {
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
    access: {
        type: String,
        required: true
    }
}, {timestamps: true})

const documentModel = mongoose.model('Document', documentSchema);
module.exports = documentModel;