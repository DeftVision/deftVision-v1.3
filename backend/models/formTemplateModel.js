const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        required: true,
    },
    required: {
        type: Boolean,
        default: false,
    }
});

const formTemplateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    fields: [fieldSchema],
})

const formTemplateModel = mongoose.model('FormTemplate', formTemplateSchema);
module.exports = formTemplateModel;