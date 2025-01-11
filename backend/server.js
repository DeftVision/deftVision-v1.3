const fs = require('fs');
const path = require('path');

// Dynamically load the correct .env file based on NODE_ENV
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
const envPath = path.resolve(__dirname, envFile);

if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
} else {
    console.error(`Environment file ${envFile} not found`);
    process.exit(1);
}

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 8005;
const connectDB = require('./config/db');
connectDB();

const userRoutes = require('./routes/userRoute')
const formTemplateRoutes = require('./routes/formTemplateRoute')
const userResponseRoutes = require('./routes/userResponseRoute')
const employeeRoutes = require('./routes/employeeRoute')
const announcementRoutes = require('./routes/announcementRoute')
const shopperRoutes = require('./routes/shopperRoute')
const documentRoutes = require('./routes/documentRoute')
const supportRoutes = require('./routes/supportRoute')



const app = express();
app.use(express.json());
app.use(cors());


app.use('/api/user', userRoutes);
app.use('/api/template', formTemplateRoutes);
app.use('/api/responses', userResponseRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/announcement', announcementRoutes);
app.use('/api/shopper', shopperRoutes);
app.use('/api/document', documentRoutes)
app.use('/api/support', supportRoutes)




app.listen(PORT, () => console.log(`Listening on port ${PORT}`));