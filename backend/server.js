// Set NODE_ENV dynamically (webstorm)
process.env.NODE_ENV = process.env.NODE_ENV || "development";

const dotenv = require("dotenv");

// Dynamically load the appropriate .env file
const ENV_FILE = `.env.${process.env.NODE_ENV}`;
console.log(`🔹 Loading environment variables from: ${ENV_FILE}`);
dotenv.config({ path: ENV_FILE });

// Confirm environment is loaded properly
if (!process.env.DATABASE_URL) {
    console.error("ERROR: DATABASE_URL is missing from environment variables!");
    process.exit(1);
}
console.log("ENV LOADED SUCCESSFULLY!");
console.log("DATABASE_URL from .env:", process.env.DATABASE_URL);
console.log("AWS Keys Loaded:", process.env.AWS_ACCESS_KEY_ID ? "OK" : "MISSING");

// Dependencies
const express = require("express");
const cors = require("cors");
const redis = require("./redisClient");
const connectDB = require("./config/db");
const mongoose = require("mongoose");

// Ensure MongoDB Connection
console.log("Connected to MongoDB Database:", mongoose.connection.name);
connectDB();

// Initialize Express
const app = express();

// Middleware
app.use(express.json());

// Configure CORS
const corsOptions = {
    origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim()) : "*",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 200
};

// Enable CORS
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

// API Health Check
app.get("/api/status", (req, res) => {
    res.json({ status: "ok", message: "Backend is running successfully!" });
});


// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Uncaught Server Error:", {
        message: err.message,
        stack: err.stack,
        request: {
            method: req.method,
            url: req.originalUrl,
            body: req.body,
        }
    });
    res.status(500).json({ error: "Internal Server Error", details: err.message });
});

// Start the server
const PORT = process.env.PORT;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
});