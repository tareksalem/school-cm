const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require("express-session");
const flash = require("connect-flash");
const hbs = require("express-handlebars");
const handlebars = require("handlebars");
var HandlebarsIntl = require('handlebars-intl');
HandlebarsIntl.registerWith(handlebars);
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
var expressValidator = require("express-validator");
const multer = require("multer");
const sanitize = require("sanitize-html");
const mongodb = require("mongodb");
const mongoose = require("mongoose");
//mongoose.connect("mongodb://tarek:tareksalem1@ds159235.mlab.com:59235/mongotarek");
mongoose.connect("localhost:27017/school");
const db = mongoose.connection;
const mongooseDelete = require("mongoose-delete");
const index = require('./routes/index');
const users = require('./routes/controllers/users');
require("./config/assistant");
/*const storage = multer.diskStorage({
    destination: "../public/images",
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});*/
const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine("hbs", hbs({defaultLayout: "layout", extname: "hbs"}));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// use session module
app.use(session({
    secret: "max",
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(function (req, res, next) {
    res.locals.message = require("express-messages")(req, res);
    res.locals.login = req.isAuthenticated();
    res.locals.notlogin = !req.isAuthenticated();
    next();
});
app.use('/', index);
app.use('/controllers', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
