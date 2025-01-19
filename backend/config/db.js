// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    const connectWithRetry = async (retries = 5, delay = 5000) => {
        try {
            // Attempt to connect to MongoDB
            const conn = await mongoose.connect(process.env.DATABASE_URL); // Options no longer needed
            console.log(`MongoDB connected: ${conn.connection.host}`);
        } catch (error) {
            console.error(`MongoDB connection error: ${error.message}`);

            // Retry logic
            if (retries > 0) {
                console.log(
                    `Retrying MongoDB connection in ${delay / 1000} seconds... (${retries} retries left)`
                );
                setTimeout(() => connectWithRetry(retries - 1, delay), delay);
            } else {
                console.error('MongoDB connection failed after maximum retries. Exiting...');
                process.exit(1); // Exit the process if all retries fail
            }
        }
    };

    // Initiate the first connection attempt
    connectWithRetry();
};

module.exports = connectDB;
