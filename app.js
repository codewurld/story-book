const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// load config
dotenv.config({ path: './config/config.env' })

const app = express();

const PORT = process.env.PORT || 8080

// connect app to DB
connectDB();



app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`))