'use strict';

const express = require('express');
const app = express();

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const yaml = require('js-yaml');
const fs = require('fs');

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

// Export the Open API specification to a file
// To convert between format versions use: https://lucybot-inc.github.io/api-spec-converter/
if (process.env.GEN_OPENAPI_SPEC === 1) {
  const swaggerSpecYaml = yaml.dump(swaggerDocs);
  fs.writeFileSync('./openapi-spec.yaml', swaggerSpecYaml);
}

module.exports = app;
