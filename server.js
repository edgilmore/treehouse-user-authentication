const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config.json');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const csurf = require('csurf');
// const webpack = require('webpack');
// const webpackMiddleware = require('webpack-dev-middleware');
// const webpackHotMiddleware = require('webpack-hot-middleware');
const routes = require('./routes/index');
const users = require('./routes/users');
const register = require('./routes/register');
const login = require('./routes/login');
const profile = require('./routes/profile');
const logout = require('./routes/logout');

const app = express();

// azure cosmosdb connection
mongoose.connect(`${config.mongo_database}`, {}, (error) => {
    if (error) {
        throw error;
    }
});
// init connection
const db = mongoose.connection;

// error handler for mongo
db.on('error', (error) => {
    throw error;
});

// add a session store
const store = new MongoDbStore({
    uri: `${config.mongo_database}`,
    collection: 'sessions',
});

// store error handler
store.on('error', (error) => {
    if (error) {
        store.clear(() => {
            throw error;
        });
    }
});

// add session management to the server
app.use(session({
    secret: 'treehouse authentication',
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 24 * 24 * 7, // 1 week
    },
    store,
}));
// setup cookie parser
app.use(cookieParser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false,
}));

// add cross site anti forgery middleware
const csurfProtection = csurf();
app.use(csurfProtection);

app.use(require('node-sass-middleware')({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true,
    sourceMap: true,
}));

app.use(express.static(path.join(__dirname, 'public')));

// make user id availale to templates
app.use((req, res, next) => {
    res.locals.currentUser = req.session.userId;
    next();
});

// register routes
app.use('/', routes);
app.use('/users', users);
app.use('/register', register);
app.use('/login', login);
app.use('/profile', profile);
app.use('/logout', logout);

// catch 404 and forward to error handler
app.use((err, req, res, next) => {
    err.message = 'Not Found';
    err.status = 404;
    next(err);
});

// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((req, res) => {
        res.status(res.statusCode || 500);
        res.render('error', {
            message: res.message,
            error: res,
        });
    });
} else {
    // production error handler
    // no stacktraces leaked to user
    app.use((req, res) => {
        res.status(res.statusCode || 500);
        res.render('error', {
            message: res.message,
            error: {},
        });
    });
}

module.exports = app;
