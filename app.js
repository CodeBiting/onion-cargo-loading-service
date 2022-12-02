var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
const logger = require("./api/logger");

var containerRouterV1 = require('./routes/v1/container');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const morganFormat = process.env.NODE_ENV !== 'production' ? 'dev' : 'combined';
app.use(
  morgan(morganFormat, {
    skip: function(req, res) {
      return res.statusCode < 400;
    },
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  })
);
app.use(
  morgan(morganFormat, {
    skip: function(req, res) {
      return res.statusCode >= 400;
    },
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  })
);

logger.info(`Node environment = ${(process.env.NODE_ENV ? process.env.NODE_ENV : 'development')}`);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/v1/container', containerRouterV1);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
