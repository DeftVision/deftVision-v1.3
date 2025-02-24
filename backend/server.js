'use strict';
// Load environment variables
process.env.NODE_ENV = process.env.NODE_ENV || "beta"; // Ensure NODE_ENV is set

require("dotenv").config({
    path: `.env.${process.env.NODE_ENV}`,
});

console.log("ENV LOADED:", process.env.AWS_ACCESS_KEY_ID ? "OK" : "MISSING");

// Dependencies
const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const Redis = require("ioredis");
const connectDB = require('./config/db');

// Ensure required environment variables are set
if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is missing from environment variables!");
    process.exit(1);
}

// Initialize Redis with ENV variables
const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD,
    retryStrategy: (times) => {
        console.log(`Redis reconnect attempt ${times}`);
        return Math.min(times * 100, 5000); // Exponential backoff, max 5s
    }
});

redis.on("connect", () => console.log("✅ Connected to Redis successfully!"));
redis.on("error", (err) => console.error("Redis connection error:", err));

// Graceful shutdown handling
process.on('SIGINT', async () => {
    console.log("Closing Redis connection...");
    await redis.quit();
    process.exit(0);
});

// Connect to MongoDB
connectDB();

// Initialize Express
const app = express();
app.use(express.json());

// Configure CORS
const corsOptions = {
    origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim()) : '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
};
app.use(cors(corsOptions));

// Middleware for Redis Cache
const cacheMiddleware = async (req, res, next) => {
    try {
        const key = req.originalUrl;
        const cachedData = await redis.get(key);
        if (cachedData) {
            return res.json({ source: "cache", data: JSON.parse(cachedData) });
        }
        next();
    } catch (err) {
        console.error("Redis Cache Error:", err);
        next();
    }
};

// Use Redis Cache for API Routes
app.get('/api/data', cacheMiddleware, async (req, res) => {
    try {
        const freshData = { message: "Hello from MongoDB!" };
        await redis.setEx(req.originalUrl, 3600, JSON.stringify(freshData));
        res.json({ source: "database", data: freshData });
    } catch (error) {
        res.status(500).json({ error: "Error fetching data", details: error.message });
    }
});

// API Routes
app.use('/api/user', require('./routes/userRoute'));
app.use('/api/template', require('./routes/formTemplateRoute'));

// Health check route
app.get('/api/status', (req, res) => {
    res.json({ status: "ok", message: "Backend is running successfully!" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
