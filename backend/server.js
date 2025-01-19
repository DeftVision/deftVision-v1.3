// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
require('dotenv').config({ path: `./.env.${process.env.NODE_ENV || 'production'}` });

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());

// CORS configuration
const corsOptions = {
    origin: process.env.CORS_ORIGINS?.split(',') || '*', // Optional: Configure CORS origins from environment
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};
app.use(cors(corsOptions));

// Import and use routes
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

// Serve React static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
    });
}

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(`Server running in ${process.env.NODE_ENV || 'production'} mode on port ${PORT}`)
);
