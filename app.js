const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path')
const exphbs = require('express-handlebars');
const connectDB = require('./config/db');
const PORT = process.env.PORT || 8080

// load config
dotenv.config({ path: './config/config.env' });

// connect app to DB
connectDB();

const app = express();

// logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
};

// handlebars view engine
app.engine('.hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }));
app.set('view engine', '.hbs');

// Static folder
app.use(express.static(path.join(__dirname, 'public')))


// Routes - all / requests connects to index file
app.use('/', require('./routes/index'));




app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`))