const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 8005;
const connectDB = require('./config/db');
connectDB();

const userRoutes = require('./routes/userRoute')
const formTemplateRouters = require('./routes/formTemplateRouter')

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/user', userRoutes);
app.use('/api/template', formTemplateRouters);




app.listen(PORT, () => console.log(`Listening on port ${PORT}`));