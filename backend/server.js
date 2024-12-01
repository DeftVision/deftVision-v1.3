const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 8005;
const connectDB = require('./config/db');
connectDB();

const userRoutes = require('./routes/userRoute')
const formTemplateRoutes = require('./routes/formTemplateRoute')
const userResponseRoutes = require('./routes/userResponseRoute')
const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/user', userRoutes);
app.use('/api/template', formTemplateRoutes);
app.use('/api/responses', userResponseRoutes);



app.listen(PORT, () => console.log(`Listening on port ${PORT}`));