'use strict';
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Debug: Log loaded environment variables
console.log('Loaded DATABASE_URL:', process.env.DATABASE_URL);

// Ensure DATABASE_URL is loaded before connecting to MongoDB
if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is missing from environment variables!");
    process.exit(1);
}

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());

// Configure CORS
const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
    : [];

console.log('Resolved CORS Origins:', corsOrigins);

const corsOptions = {
    origin: corsOrigins.length > 0 ? corsOrigins : '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
};
app.use(cors(corsOptions));

// Log incoming requests
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// Import API routes
const userRoutes = require('./routes/userRoute');
const formTemplateRoutes = require('./routes/formTemplateRoute');
const userResponseRoutes = require('./routes/userResponseRoute');
const employeeRoutes = require('./routes/employeeRoute');
const announcementRoutes = require('./routes/announcementRoute');
const shopperRoutes = require('./routes/shopperRoute');
const documentRoutes = require('./routes/documentRoute');
const supportRoutes = require('./routes/supportRoute');

app.use('/api/user', userRoutes);
app.use('/api/template', formTemplateRoutes);
app.use('/api/responses', userResponseRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/announcement', announcementRoutes);
app.use('/api/shopper', shopperRoutes);
app.use('/api/document', documentRoutes);
app.use('/api/support', supportRoutes);

// Health check route
app.get('/api/status', (req, res) => {
    res.json({ status: "ok", message: "Backend is running successfully!" });
});

// Serve React static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
    });
}

// Catch-all error handler (Prevents server crashes)
app.use((err, req, res, next) => {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'production'} mode on port ${PORT}`);
});

