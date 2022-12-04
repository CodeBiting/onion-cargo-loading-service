//var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');

const logger = require("./api/logger");

//var expressOpenAPI = require('express-openapi');
var openapi = require('express-openapi');
var swaggerUi = require('swagger-ui-express');
//import { initialize } from 'express-openapi';
var v1ContainerService = require('./api-v1/services/containerService');
var v1ApiDoc = require('./api-v1/api-doc');


var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'pug');

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

/*
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
*/

// OpenAPI routes
openapi.initialize({
  app: app,
  apiDoc: v1ApiDoc,
  dependencies: {
    containerService: v1ContainerService
  },
  paths: "./api-v1/paths",
});

// OpenAPI UI
app.use(
  "/api-documentation",
  swaggerUi.serve,
  swaggerUi.setup(null, {
    swaggerOptions: {
      // S'ha de posar la ruta amb la versió, tal i com s'indica al atribut basePath del fitxer api-v1/api-doc.js
      url: "http://localhost:3000/v1/api-docs",
    },
  })
);
logger.info(`API Documentation in http://localhost:3000/api-documentation/`);

module.exports = app;
