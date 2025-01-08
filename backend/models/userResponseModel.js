const mongoose = require('mongoose');

const userResponseSchema = new mongoose.Schema({
    templateId: { type: mongoose.Schema.Types.ObjectId, ref: 'FormTemplate', required: true },
    responses: [
        {
            field: { type: String, required: true },
            response: {type: mongoose.Schema.Types.Mixed}
        },
    ],
    createdAt: { type: Date, default: Date.now }
})

const responseModel = mongoose.model("UserResponse", userResponseSchema);
module.exports = responseModel;