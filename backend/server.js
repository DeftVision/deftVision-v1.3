const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const redis = require("redis");
const listEndpoints = require("express-list-endpoints");

// Load environment variables
dotenv.config({ path: `.env.${process.env.NODE_ENV || "development"}` });
console.log(`🔹 Loading environment variables from: .env.${process.env.NODE_ENV || "development"}`);

// Initialize Express app
const app = express();

// Middleware
app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests
app.use(cors());

// Debug: Logging middleware to confirm requests are being processed
app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});

// Connect to MongoDB
const mongoURI = process.env.DATABASE_URL || "mongodb://localhost:27017/Development";
console.log(`DATABASE_URL from .env: ${mongoURI}`);

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log(`Connected to MongoDB Database: ${mongoose.connection.name}`))
    .catch((err) => console.error("MongoDB Connection Error:", err));

// Connect to Redis
const redisClient = redis.createClient({
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || null,
    connectTimeout: 10000,
});

redisClient.on("connect", () => console.log("Connected to Redis successfully"));
redisClient.on("error", (err) => console.error("Redis Connection Error:", err));

// Register Routes
console.log("Registering routes in server.js...");
app.use("/api/user", require("./routes/userRoute"));
app.use("/api/template", require("./routes/formTemplateRoute"));
app.use("/api/responses", require("./routes/userResponseRoute"));
app.use("/api/employee", require("./routes/employeeRoute"));
app.use("/api/announcement", require("./routes/announcementRoute"));
app.use("/api/shopper", require("./routes/shopperRoute"));
app.use("/api/document", require("./routes/documentRoute"));
app.use("/api/support", require("./routes/supportRoute"));
console.log("✅ Finished registering all routes.");

// Debug: Log all registered endpoints
console.log("Registered API Routes:", listEndpoints(app));

// Health Check Route
app.get("/api/status", (req, res) => {
    res.status(200).json({ status: "OK", message: "Server is running" });
});

// Start Server
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
});
<<<<<<< HEAD

// Start the server
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
});
=======
>>>>>>> 71d6f58 (Add Redis integration and S3 upload enhancements)
