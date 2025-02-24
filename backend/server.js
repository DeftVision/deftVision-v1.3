'use strict';
// Load environment variables
process.env.NODE_ENV = process.env.NODE_ENV || "beta"; // Ensure NODE_ENV is set

require("dotenv").config({
    path: `.env.${process.env.NODE_ENV}`,
});

console.log("ENV LOADED:", process.env.AWS_ACCESS_KEY_ID ? "OK" : "MISSING");
console.log("Loaded .env File:", `.env.${process.env.NODE_ENV}`);
console.log("AWS Bucket:", process.env.AWS_S3_BUCKET_NAME);
console.log("AWS Key:", process.env.AWS_ACCESS_KEY_ID ? "LOADED" : "MISSING");

// Dependencies
const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const path = require('path');
const Redis = require("ioredis");
const connectDB = require('./config/db');

// Ensure required environment variables are set
if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is missing from environment variables!");
    process.exit(1);
}

// ✅ 1. Initialize Redis with EC2 Remote Connection Settings
const redis = new Redis({
    host: process.env.REDIS_HOST || "3.132.32.218", // EC2 Redis Server
    port: 6379, // Default Redis Port
    password: process.env.REDIS_PASSWORD || "4hTF7h7pocHGSB&G", // Redis Password
    retryStrategy: (times) => Math.min(times * 50, 2000), // Retry logic
});

redis.on("connect", () => console.log("✅ Connected to Redis successfully!"));
redis.on("error", (err) => console.error("❌ Redis connection error:", err));

// Connect to MongoDB
connectDB();

// Initialize Express
const app = express();

// Middleware
app.use(express.json());

// Configure CORS
const corsOptions = {
    origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim()) : '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
};
app.use(cors(corsOptions));

// ✅ 2. Middleware for Checking Cache (Redis)
const cacheMiddleware = async (req, res, next) => {
    try {
        const key = req.originalUrl;
        const cachedData = await redis.get(key);
        if (cachedData) {
            return res.json({ source: "cache", data: JSON.parse(cachedData) });
        }
        next(); // Continue to actual API handler if not cached
    } catch (err) {
        console.error("❌ Redis Cache Error:", err);
        next(); // Proceed if Redis fails
    }
};

// ✅ 3. Use Redis Cache for API Routes
app.get('/api/data', cacheMiddleware, async (req, res) => {
    try {
        const freshData = { message: "Hello from MongoDB!" }; // Replace with actual DB query
        await redis.setEx(req.originalUrl, 3600, JSON.stringify(freshData)); // Cache for 1 hour
        res.json({ source: "database", data: freshData });
    } catch (error) {
        res.status(500).json({ error: "Error fetching data", details: error.message });
    }
});

// API Routes
app.use('/api/user', require('./routes/userRoute'));
app.use('/api/template', require('./routes/formTemplateRoute'));
app.use('/api/responses', require('./routes/userResponseRoute'));
app.use('/api/employee', require('./routes/employeeRoute'));
app.use('/api/announcement', require('./routes/announcementRoute'));
app.use('/api/shopper', require('./routes/shopperRoute'));
app.use('/api/document', require('./routes/documentRoute'));
app.use('/api/support', require('./routes/supportRoute'));

// Health check route
app.get('/api/status', (req, res) => {
    res.json({ status: "ok", message: "Backend is running successfully!" });
});

// Catch-all error handler (Prevents server crashes)
app.use((err, req, res, next) => {
    console.error("❌ Uncaught Server Error:", {
        message: err.message,
        stack: err.stack,
        request: {
            method: req.method,
            url: req.originalUrl,
            body: req.body
        }
    });
    res.status(500).json({ error: "Internal Server Error", details: err.message });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'production'} mode on port ${PORT}`);
});
