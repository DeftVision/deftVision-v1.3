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
    { timestamps: true, collection: "users" }
);

// virtual field: fullName
userSchema.virtual('fullName').get(function () {
    return `${this.firstName} ${this.lastName}`
});


// virtual included in JSON output
userSchema.set('toJSON', { virtuals: true})
userSchema.set('toObject', { virtuals: true})


const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
