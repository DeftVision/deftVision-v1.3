'use strict';

// Load environment variables
require("dotenv").config({
    path: `.env.${process.env.NODE_ENV || "development"}`,
});

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

// Initialize Redis (Ensure Redis is running before using it)
const redis = new Redis();
redis.on("error", (err) => {
    console.error("❌ Redis connection error:", err);
});

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
