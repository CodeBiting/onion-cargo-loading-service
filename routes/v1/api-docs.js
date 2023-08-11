'use strict';

const express = require('express');
const app = express();

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'Cargo Loading API',
      description: 'This is an example of cargo loading software',
      // termsOfService: "http://swagger.io/terms/",
      contact: {
        name: 'API Support',
        url: 'https://www.codebiting.com/support'
        // email: "support@swagger.io"
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/license/mit/'
      },
      servers: ['http://localhost:8080']
    }
  },
  // APIs to document
  apis: [
    './routes/v1/healthcheck.js',
    './routes/v1/container.js',
    './routes/v1/client.js',
    './routes/v1/register.js',
    './routes/v1/help.js',
    './api/ApiResult.js'
  ]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

module.exports = app;
