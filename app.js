global.__base = __dirname + '/';

//var createError = require('http-errors');
var bodyParser = require('body-parser');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');

const logger = require("./api/logger");
const ApiResult = require(`${__base}api/ApiResult`);
const ApiError = require(`${__base}api/ApiError`);

// API V1
const apiDocsV1 = require('./routes/v1/api-docs');
const healtchcheckRouterV1 = require('./routes/v1/healthcheck');
const containerRouterV1 = require('./routes/v1/container');
const clientRouterV1 = require('./routes/v1/client');
const helpRouterV1 = require('./routes/v1/help');

const HELP_BASE_URL = '/v1/help/error';

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
app.use('/v1/client', clientRouterV1);
app.use('/v1/help', helpRouterV1);

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
app.use(function(req, res, next) {
  let status = 404;
  logger.error(`ExpressJS Error Handler : [${req.method}] ${req.protocol}://${req.get('host')}${req.url} : ${status} : Not found`);
  let error = new ApiError('NOT-FOUND-ERROR-001', 'Not found', '', `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/NOT-FOUND-ERROR-001`);
  res.status(status).json(new ApiResult("ERROR", null, [ error ]));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  let status = err.status || 500;
  logger.error(`ExpressJS Error Handler : [${req.method}] ${req.protocol}://${req.get('host')}${req.url} : ${status} : ${err.message}`);
  let error = new ApiError('GENERIC-ERROR-001', err.message, '', `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/GENERIC-ERROR-001`);
  res.status(status).json(new ApiResult("ERROR", null, [ error ]));
});

module.exports = app;
