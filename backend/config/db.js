const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const dbUri = process.env.DATABASE_URL;
        if (!dbUri) {
            console.error("DATABASE_URL is not defined in environment variables");
            process.exit(1);
        }

        const conn = await mongoose.connect(dbUri, {
            serverSelectionTimeoutMS: 5000, // Timeout if MongoDB is unreachable
        });

        // Log the actual database name AFTER connection is established
        console.log(`MongoDB Database: ${conn.connection.db.databaseName}`);
        console.log(`MongoDB host: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
