var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('express-async-errors');
var expressLayouts = require('express-ejs-layouts');

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
app.use("/stylesheets",express.static(path.join(__dirname, 'stylesheets')));
app.use("/javascripts",express.static(path.join(__dirname, 'javascripts')));
app.use("/images",express.static(path.join(__dirname, 'images')));



require('./middlewares/session')(app);
//require('./middlewares/view.mdw')(app);
require('./middlewares/locals')(app);
require('./middlewares/routes')(app);

module.exports = app;
