'use strict';
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
require('dotenv').config({ path: `./.env.${process.env.NODE_ENV || 'production'}` });

console.log('Loaded DATABASE_URL:', process.env.DATABASE_URL); // Log the DATABASE_URL

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());

const corsOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
    : []; // Ensure corsOrigins is always an array

console.log('Resolved CORS Origins:', corsOrigins);

const corsOptions = {
    origin: corsOrigins.length > 0 ? corsOrigins : '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
};
app.use(cors(corsOptions));

console.log('Loaded environment:', process.env);
console.log('CORS_ORIGINS:', process.env.CORS_ORIGINS);

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

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'production'} mode on port ${PORT}`);
});

