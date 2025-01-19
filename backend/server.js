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

// Safely handle undefined CORS_ORIGINS and provide logging for debugging
const corsOrigins = process.env.CORS_ORIGINS && process.env.CORS_ORIGINS.trim()
    ? process.env.CORS_ORIGINS.split(',')
    : []; // Default to an empty array if CORS_ORIGINS is undefined or empty

console.log('Resolved CORS Origins:', corsOrigins);

const corsOptions = {
    origin: corsOrigins.length > 0 ? corsOrigins : '*', // Use fallback for any origin
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

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(`Server running in ${process.env.NODE_ENV || 'production'} mode on port ${PORT}`)
);
