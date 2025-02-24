const mongoose = require('mongoose');

const connectDB = async () => {
    const connectWithRetry = async (retries = 5, delay = 5000) => {
        try {
            const dbUri = process.env.DATABASE_URL;
            if (!dbUri) {
                console.error('DATABASE_URL is missing!');
                process.exit(1);
            }

            const conn = await mongoose.connect(dbUri);
            console.log(`MongoDB connected: ${conn.connection.host}`);
            return conn;
        } catch (error) {
            console.error(`MongoDB connection failed: ${error.message}`);

            if (retries > 0) {
                console.log(`Retrying in ${delay / 1000}s... (${retries} retries left)`);
                setTimeout(() => connectWithRetry(retries - 1, delay), delay);
            } else {
                console.error('MongoDB failed after max retries. Exiting...');
                process.exit(1);
            }
        }
    };

    return connectWithRetry();
};

module.exports = connectDB;
