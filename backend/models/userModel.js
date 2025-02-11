const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true // Ensures emails are stored in lowercase
        },
        password: { type: String, required: true, select: false },
        role: { type: String, required: true },
        location: { type: String, required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);


const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
