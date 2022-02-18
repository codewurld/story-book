const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path')
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const connectDB = require('./config/db');
const PORT = process.env.PORT || 8084

// load config
dotenv.config({ path: './config/config.env' });

// passport config (passport) <- so we can use in file 
require('./config/passport')(passport)

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

// Sessions middleware
app.use(session({
    secret: 'another story',
    resave: false,
    // don't create a session until an item is stored
    saveUninitialized: false,
    // stores session in DB
}))


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static folder
app.use(express.static(path.join(__dirname, 'public')))


// Routes - all / requests connects to index file
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));




app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`))