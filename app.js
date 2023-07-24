global.__base = __dirname + '/';

//var createError = require('http-errors');
var bodyParser = require('body-parser');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var uniqid = require("uniqid");
const logger = require("./api/logger");
const ApiResult = require(`${__base}api/ApiResult`);
const ApiError = require(`${__base}api/ApiError`);
const config = require(`./config/config`);
const database = require(`./api/database`);

//Connect MySQL
database.connect(config.db, function(err) {
  if (err) {
      console.error('Unable to connect to MySQL: ' + err);
      process.exit(1);
  } else {
      database.get().query('SELECT NOW();', function (err){
        if(err){
          console.error('Unable to execute query to MySQL: ' + err);
          process.exit(1);
        } else{
          console.log(`Connected to MySQL ${config.db.database} successfully`);
        }
      });
  }
});

// API V1
const apiDocsV1 = require('./routes/v1/api-docs');
const healtchcheckRouterV1 = require('./routes/v1/healthcheck');
const containerRouterV1 = require('./routes/v1/container');
const clientRouterV1 = require('./routes/v1/client');
const registerRouterV1 = require('./routes/v1/register');
const helpRouterV1 = require('./routes/v1/help');
// UI V1
const uiClients = require('./routes/ui/v1/clients');

const HELP_BASE_URL = '/v1/help/error';

var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
//pug
app.set('views', path.join(__dirname, './routes/views'));
app.set('view engine', 'pug');

/**
 * Generate one uniqueid everytime API is called, to trace the client call
 */
app.use((req, res, next) => {
  // Get the requestId if its provided in the heather
  let requestId = req.headers["x-request-id"];
  // Save the requestId or create a new one if not exists
  req.requestId = requestId || uniqid();
  // Call the next function in the middleware
  next();
});

const morganFormat = process.env.NODE_ENV !== 'production' ? 'dev' : 'combined';
app.use(
  morgan(morganFormat, {
    // Function to determine if logging is skipped, defaults to false
    // skip: function(req, res) {
    //   // Skip logging when function has exit (returns status code < 400)
    //   return res.statusCode < 400;
    // },
    stream: {
      write: (message) => logger.http(message.trim()),
    },
  })
);

// Routes after morgan use to log each call

app.use('/v1/api-docs', apiDocsV1);

app.use('/v1/healthcheck', healtchcheckRouterV1);
app.use('/v1/container', containerRouterV1);
app.use('/v1/client', clientRouterV1);
app.use('/v1/register', registerRouterV1);
app.use('/v1/help', helpRouterV1);

//UI routes
app.use('/ui/v1/clients', uiClients);

logger.info(`Node environment = ${(process.env.NODE_ENV ? process.env.NODE_ENV : 'development')}`);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// catch 404 NOT FOUND and forward to error handler
// Ho comntem ja que totes les URL de openapi fallen en primera instància
app.use(function(req, res, next) {
  let status = 404;
  logger.error(`ExpressJS: [${req.method}] ${req.originalUrl}: ${status}: Not found`);
  let error = new ApiError('NOT-FOUND-ERROR-001', 'Not found', '', `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/NOT-FOUND-ERROR-001`);
  res.status(status).json(new ApiResult("ERROR", null, req.requestId, [ error ]));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  let status = err.status || 500;
  logger.error(`ExpressJS: [${req.method}] ${req.originalUrl}: ${status}: ${err.message}`);
  let error = new ApiError('GENERIC-ERROR-001', err.message, '', `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/GENERIC-ERROR-001`);
  res.status(status).json(new ApiResult("ERROR", null, [ error ]));
});

module.exports = app;
