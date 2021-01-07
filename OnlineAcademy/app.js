var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('express-async-errors');
var expressLayouts = require('express-ejs-layouts');
const { authVideo } = require('./middlewares/auth.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/layout');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/stylesheets", express.static(path.join(__dirname, 'stylesheets')));
app.use("/javascripts", express.static(path.join(__dirname, 'javascripts')));
app.use("/images", express.static(path.join(__dirname, 'images')));
app.use("/video", express.static(path.join(__dirname, 'video')));



require('./middlewares/session')(app);
require('./middlewares/locals')(app);
app.use('/private/:id',authVideo, function(req, res, next){
    console.log('about to send restricted file '+ req.params.id);
    next();
  });
app.use('/private', express.static(path.join(__dirname, 'private')));
require('./middlewares/routes')(app);

module.exports = app;