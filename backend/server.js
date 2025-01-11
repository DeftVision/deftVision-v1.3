const fs = require('fs');
const path = require('path'); // Required for static file handling

// Dynamically load the correct .env file based on NODE_ENV
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
const envPath = path.resolve(__dirname, envFile);

if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
} else {
    console.error(`Environment file ${envFile} not found`);
    process.exit(1);
}

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 8005;

// Connect to the database
connectDB();

// Import routes
const userRoutes = require('./routes/userRoute');
const formTemplateRoutes = require('./routes/formTemplateRoute');
const userResponseRoutes = require('./routes/userResponseRoute');
const employeeRoutes = require('./routes/employeeRoute');
const announcementRoutes = require('./routes/announcementRoute');
const shopperRoutes = require('./routes/shopperRoute');
const documentRoutes = require('./routes/documentRoute');
const supportRoutes = require('./routes/supportRoute');

const app = express();

// Middleware
app.use(express.json());

const corsOptions = {
    origin: ['https://app.deftvision.io'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};
app.use(cors(corsOptions));

// API routes
app.use('/api/user', userRoutes);
app.use('/api/template', formTemplateRoutes);
app.use('/api/responses', userResponseRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/announcement', announcementRoutes);
app.use('/api/shopper', shopperRoutes);
app.use('/api/document', documentRoutes);
app.use('/api/support', supportRoutes);

// Serve static files (React app) only in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));

    // Serve the React frontend for any route not handled by the API
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
    });


// Start the server
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}