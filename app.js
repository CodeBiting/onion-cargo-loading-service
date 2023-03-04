global.__base = __dirname + '/';

//var createError = require('http-errors');
var bodyParser = require('body-parser');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');

const logger = require("./api/logger");

const apiDocsV1 = require('./routes/v1/api-docs');

const healtchcheckRouterV1 = require('./routes/v1/healthcheck');
const containerRouterV1 = require('./routes/v1/container');

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'pug');

app.use('/v1/api-docs', apiDocsV1);

app.use('/v1/healthcheck', healtchcheckRouterV1);
app.use('/v1/container', containerRouterV1);

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


// catch 404 NOT FOUND and forward to error handler
// Ho comntem ja que totes les URL de openapi fallen en primera instància
//app.use(function(req, res, next) {
//  //next(createError(404));
//  logger.info(`404 NOT FOUND ${req.url}`);
//  next();
//});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  //res.status(err.status || 500);
  //res.render('error');
  logger.error(`Error ${req.url} - ${err.status || 500} - ${err.message}`);
  res.send();
});

module.exports = app;
