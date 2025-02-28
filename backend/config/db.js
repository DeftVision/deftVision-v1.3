// db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    const connectWithRetry = async (retries = 5, delay = 5000) => {
        try {
            // Ensure DATABASE_URL exists
            const dbUri = process.env.DATABASE_URL;
            if (!dbUri) {
                console.error('DATABASE_URL is not defined in environment variables');
                process.exit(1);
            }

            // 🔗 Attempt to connect to MongoDB with explicit database selection
            const conn = await mongoose.connect(dbUri, {
                dbName: "beta",  // Ensure the correct database is used
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 5000, // Timeout if MongoDB is unreachable
            });

            console.log(`✅ MongoDB connected: ${conn.connection.host}`);
        } catch (error) {
            console.error(`❌ MongoDB connection error: ${error.message}`);

            // Retry logic
            if (retries > 0) {
                console.log(`🔄 Retrying MongoDB connection in ${delay / 1000} seconds... (${retries} retries left)`);
                setTimeout(() => connectWithRetry(retries - 1, delay), delay);
            } else {
                console.error('MongoDB connection failed after maximum retries. Exiting...');
                process.exit(1);
            }
        }
    };

    // Start the connection attempt
    connectWithRetry();
};

module.exports = connectDB;
