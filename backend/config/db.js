const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('MongoDB connected');
        console.log(process.env.DATABASE_URL)
    } catch {
        console.log('MongoDB connection error');
    }
}

module.exports = connectDB;