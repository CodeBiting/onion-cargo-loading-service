const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const uniqid = require('uniqid');
const logger = require('./api/logger');
const ApiResult = require('./api/ApiResult');
const ApiError = require('./api/ApiError');
// const config = require('./config/config');
const database = require('./api/database');
const fs = require('fs');

// Connect MySQL
let db = {};

if (fs.existsSync('./config/config.js')) {
  const config = require('./config/config');
  db = config.db;
} else {
  db.host = process.env.DB_HOST;
  db.port = process.env.DB_PORT;
  db.database = process.env.DB_DATABASE;
  db.user = process.env.DB_USER;
  db.password = process.env.DB_PASSWORD;
  db.connectionLimit = process.env.DB_CONNECTION_LIMIT;
}

database.connect(db, function (err) {
  if (err) {
    console.error('Unable to connect to MySQL: ' + err);
    process.exit(1);
  } else {
    database.get().query('SELECT NOW();', function (err) {
      if (err) {
        console.error('Unable to execute query to MySQL: ' + err);
        process.exit(1);
      } else {
        console.log(`Connected to MySQL ${db.database} successfully`);
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
const uiContainers = require('./routes/ui/v1/containers');
const uiRegisters = require('./routes/ui/v1/registers');

const HELP_BASE_URL = '/v1/help/error';

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// pug
app.set('views', path.join(__dirname, './routes/views'));
app.set('view engine', 'pug');

/**
 * Autenticate and autorize the requests
 * Generate one uniqueid everytime API is called, to trace the client call
 */
app.use(async (req, res, next) => {
  /* if (req.url && !req.url.startsWith('/v1/api-docs')) {
    // Autenticate and autorize the requests
    if (!req.query || !req.query.token || !req.query.clientId) {
      logger.error(`Authentication error, missing clientId or token: [${req.method}] ${req.originalUrl}`);
      // En la resposta no indiquem el motiu de l'error per no ajudar a possibles atacants
      let error = new ApiError('GENERIC-ERROR-001', 'Bad request', '', `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/GENERIC-ERROR-001`);
      return res.status(BAD_REQUEST).json(new ApiResult("ERROR", null, [ error ]));
    }

    // Check the authorization data provided is correct
    if (await clientService.isAuthenticacionValid(req.query.clientId, req.query.token) !== true) {
      logger.error(`Authentication error, incorrect clientId or token: [${req.method}] ${req.originalUrl}`);
      // En la resposta no indiquem el motiu de l'error per no ajudar a possibles atacants
      let error = new ApiError('AUTHORIZATION-ERROR-001', 'Authorization error', '', `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/AUTHORIZATION-ERROR-001`);
      return res.status(UNAUTHORIZED).json(new ApiResult("ERROR", null, [ error ]));
    }

    // Check the client has access to the resource requested
    if (await clientService.hasAccessToTheResource(req.query.clientId, req.originalUrl) !== true) {
      logger.error(`Authorization error, clientId ${req.query.clientId} don't have access to the resource ${req.originalUrl}: [${req.method}] ${req.originalUrl}`);
      // En la resposta no indiquem el motiu de l'error per no ajudar a possibles atacants
      let error = new ApiError('AUTHORIZATION-ERROR-001', 'Authorization error', '', `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/AUTHORIZATION-ERROR-001`);
      return res.status(FORBIDDEN).json(new ApiResult("ERROR", null, [ error ]));
    }
  } */

  // Get the requestId if its provided in the heather
  const requestId = req.headers['x-request-id'];
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
      write: (message) => logger.http(message.trim())
    }
  })
);

// Routes after morgan use to log each call

app.use('/v1/api-docs', apiDocsV1);

app.use('/v1/healthcheck', healtchcheckRouterV1);
app.use('/v1/container', containerRouterV1);
app.use('/v1/client', clientRouterV1);
app.use('/v1/register', registerRouterV1);
app.use('/v1/help', helpRouterV1);

// UI routes
app.use('/ui/v1/clients', uiClients);
app.use('/ui/v1/containers', uiContainers);
app.use('/ui/v1/registers', uiRegisters);

logger.info(`Node environment = ${(process.env.NODE_ENV ? process.env.NODE_ENV : 'development')}`);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// catch 404 NOT FOUND and forward to error handler
// Ho comntem ja que totes les URL de openapi fallen en primera instància
app.use(function (req, res, next) {
  const status = 404;
  logger.error(`ExpressJS: [${req.method}] ${req.originalUrl}: ${status}: Not found`);
  const error = new ApiError('NOT-FOUND-ERROR-001', 'Not found', '', `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/NOT-FOUND-ERROR-001`);
  res.status(status).json(new ApiResult('ERROR', null, req.requestId, [error]));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  const status = err.status || 500;
  logger.error(`ExpressJS: [${req.method}] ${req.originalUrl}: ${status}: ${err.message}`);
  const error = new ApiError('GENERIC-ERROR-001', err.message, '', `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/GENERIC-ERROR-001`);
  res.status(status).json(new ApiResult('ERROR', null, [error]));
});

module.exports = app;
