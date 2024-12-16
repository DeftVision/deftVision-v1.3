const mongoose = require('mongoose');

const shopperSchema = new mongoose.Schema({
    dateTime: {
        type: Date,
        default: Date.now
    },
    shopperName: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    greeting: {
        type: Boolean,
        default: false
    },
    cashier: {
        type: String,
        required: true
    },
    orderRepeated: {
        type: Boolean,
        default: false
    },
    upsell: {
        type: Boolean,
        default: false
    },
    wait: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
    },
    foodScore: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
    },
    serviceScore: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
    },
    cleanScore: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
    },
    finalScore: {
        type: Number,
        required: true,
        min: 0,
        max: 10,
    },
    comments: {
        type: String,
        required: true
    }

}, {timestamps: true})

const shopperModel = mongoose.model("Shopper",shopperSchema);
module.exports = shopperModel;