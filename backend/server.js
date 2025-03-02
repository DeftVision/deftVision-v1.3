// Load environment variables
process.env.NODE_ENV = process.env.NODE_ENV || ".env.development";

require("dotenv").config({
    path: `.env.${process.env.NODE_ENV}`,
});

console.log("DATABASE_URL from .env:", process.env.DATABASE_URL);
console.log("ENV LOADED:", process.env.AWS_ACCESS_KEY_ID ? "OK" : "MISSING");
console.log("Loaded .env File:", `.env.${process.env.NODE_ENV}`);
// console.log("AWS Bucket:", process.env.AWS_S3_BUCKET_NAME);
// console.log("AWS Key:", process.env.AWS_ACCESS_KEY_ID ? "LOADED" : "MISSING");


// Dependencies
const express = require("express");
const cors = require("cors");
const redis = require("./redisClient");
const connectDB = require("./config/db");
const mongoose = require('mongoose');
console.log("Connected to MongoDB Database:", mongoose.connection.name);
// Ensure required environment variables are set
if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is missing from environment variables!");
    process.exit(1);
}

redis.on("error", (err) => console.error("Redis connection error:", err));

// Connect to MongoDB
connectDB();

// Initialize Express
const app = express();

// Middleware
app.use(express.json());

// Configure CORS
// Middleware
const corsOptions = {
    origin: process.env.CORS_ORIGINS
        ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
        : "*",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"], // Add OPTIONS explicitly
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    preflightContinue: false,  // Ensure CORS preflight response is automatic
    optionsSuccessStatus: 200, // Change from 204 to 200 for better handling
};

// Enable CORS
app.use(cors(corsOptions));

// Explicitly handle OPTIONS requests
app.options("*", cors(corsOptions));



// API Routes
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/template", require("./routes/formTemplateRoute"));
app.use("/api/responses", require("./routes/userResponseRoute"));
app.use("/api/employee", require("./routes/employeeRoute"));
app.use("/api/announcement", require("./routes/announcementRoute"));
app.use("/api/shopper", require("./routes/shopperRoute"));
app.use("/api/document", require("./routes/documentRoute"));
app.use("/api/support", require("./routes/supportRoute"));

app.get("/api/status", (req, res) => {
    res.json({ status: "ok", message: "Backend is running successfully!" });
});


// Catch-all error handler (Prevents server crashes)
app.use((err, req, res, next) => {
    console.error("Uncaught Server Error:", {
        message: err.message,
        stack: err.stack,
        request: {
            method: req.method,
            url: req.originalUrl,
            body: req.body,
        },
    });
    res.status(500).json({ error: "Internal Server Error", details: err.message });
});

const PORT = process.env.PORT || 8006;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
});
