// Load environment variables
process.env.NODE_ENV = process.env.NODE_ENV || "beta";

require("dotenv").config({
    path: `.env.${process.env.NODE_ENV}`,
});

console.log("ENV LOADED:", process.env.AWS_ACCESS_KEY_ID ? "OK" : "MISSING");
console.log("Loaded .env File:", `.env.${process.env.NODE_ENV}`);
console.log("AWS Bucket:", process.env.AWS_S3_BUCKET_NAME);
console.log("AWS Key:", process.env.AWS_ACCESS_KEY_ID ? "LOADED" : "MISSING");

// Dependencies
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const redis = require("./redisClient");
const connectDB = require("./config/db");

// Ensure required environment variables are set
if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is missing from environment variables!");
    process.exit(1);
}

console.log("REDIS PASSWORD LOADED:", process.env.REDIS_PASSWORD ? "YES" : "NO");
console.log("Redis Config:", {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD ? "SET" : "MISSING",
});

redis.on("connect", async () => {
    console.log("✅ Connected to Redis successfully");

    try {
        // Explicitly authenticate Redis connection
        await redis.auth(process.env.REDIS_PASSWORD);
        console.log("🔑 Redis authentication successful");

        // Test authentication with a PING command
        const pingResponse = await redis.ping();
        console.log("Redis PING response:", pingResponse);
    } catch (error) {
        console.error("❌ Redis authentication failed:", error);
    }
});

redis.on("error", (err) => console.error("❌ Redis connection error:", err));

// Connect to MongoDB
connectDB();

// Initialize Express
const app = express();

// Middleware
app.use(express.json());

// Configure CORS
const corsOptions = {
    origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim()) : "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
};
app.use(cors(corsOptions));

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

// Start the server
// app.listen(PORT, () => {
//    console.log(`🚀 Server running in ${process.env.NODE_ENV || "production"} mode on port ${PORT}`);
//});


const PORT = process.env.PORT || 8006;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
