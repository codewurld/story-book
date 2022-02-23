const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const mongoose = require('mongoose');
const path = require('path')
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const methodOverride = require('method-override');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 8084

// load config
dotenv.config({ path: './config/config.env' });

// passport config (passport) <- so we can use in file 
require('./config/passport')(passport)

// connect app to DB
connectDB();

const app = express();

// Body Parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json())

// Method override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        let method = req.body._method
        delete req.body._method
        return method
    }
}))

// logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
};

// Handlebars Helpers
const { formatDate, truncate, stripTags, editIcon, select } = require('./helpers/hbs');

// handlebars view engine
app.engine('.hbs', exphbs.engine({
    helpers: {
        formatDate,
        stripTags,
        truncate,
        editIcon,
        select
    },
    defaultLayout: 'main', extname: '.hbs'
}));
app.set('view engine', '.hbs');

// Sessions middleware
app.use(session({
    secret: 'another story',
    resave: false,
    // don't create a session until an item is stored
    saveUninitialized: false,
    // stores session in DB and prevents push out
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI })
}))


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Set global variable
app.use(function (req, res, next) {
    res.locals.user = req.user;
    next();
})

// Static folder
app.use(express.static(path.join(__dirname, 'public')))


// Routes - all / requests connects to index file
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));




app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`))