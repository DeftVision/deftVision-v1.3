const mongoose = require('mongoose');


const employeeSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {timestamps: true});

const employeeModel =  mongoose.model('Employee', employeeSchema);
module.exports = employeeModel;