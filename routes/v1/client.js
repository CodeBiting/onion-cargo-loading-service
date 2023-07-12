var express = require('express');
var router = express.Router();

const logger = require(`${__base}api/logger`);
const ApiResult = require(`${__base}api/ApiResult`);
const ApiError = require(`${__base}api/ApiError`);
const clientService = require(`${__base}api/v1/clientService`);
const containerService = require(`${__base}api/v1/containerService`);

const HELP_BASE_URL = '/v1/help/error';

// Constants to structure logs
const API_NAME = 'client';

/**
 * @swagger
 * definitions:
 *   schemas:
 *     Client:
 *       tags:
 *         - Clients
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         code:
 *           type: string
 *         dateStart:
 *           type: string
 *           description: DateTime when the client starts its service. In format 'YYYY-MM-DD hh:mm:ss' in local date time
 *           example: 2023-12-25 12:45:32
 *         dateFinal:
 *           type: string
 *           description: DateTime when the client ends its service. In format 'YYYY-MM-DD hh:mm:ss' in local date time
 *           example: 2023-12-25 12:45:32
 *         active:
 *           type: boolean
 *           example: true
 *         token:
 *           type: string
 *           description: Token to comunicate, its checked on every API call.
 *         notes:
 *           type: string
 *       required: ['id', 'code', 'dateStart', 'dateFinal', 'active', 'token', 'notes']
 */

/**
 * @swagger
 * /v1/client:
 *   get:
 *     tags:
 *       - Clients
 *     summary: Returns clients
 *     description: Returns all the clients
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: ApiResult object with all clients found in data attribute
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/ApiResult'
 */
router.get('/',async function(req, res, next) {
  let errors = [];
  let status = 200;
  let clients = null;
  try {
    clients = await clientService.getClients();
  } catch (ex) {
    logger.error(
      `${API_NAME}: [${req.method}] ${req.originalUrl}: reqId=${req.requestId} : ${ex}`
    );
    status = 500;
    errors.push(
      new ApiError(
        'CLIENT-001',
        'Internal server error',
        `An error occurred while retrieving the clients: ${ex.message}`,
        `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CLIENT-001`
      )
    );
  }

  res
    .status(status)
    .json(
      new ApiResult(
        status === 200 ? 'OK' : 'ERROR',
        clients,
        req.requestId,
        errors
      )
    );
});

/**
 * @swagger
 *   /v1/client/{id}/containers:
 *  get:
 *     tags:
 *       - Clients
 *     summary: Returns clients
 *     description: Returns all the clients
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the container to update
 *         schema:
 *           type: integer
 *         required: false
 *     responses:
 *       200:
 *         description: ApiResult object with all clients found in data attribute
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/ApiResult'
 */

router.get('/:id/containers', async function(req, res, next) {
  let status = 200;
  let containers = null;
  let errors = [];
  try {
    containers = await containerService.getClientContainers(req.params.id);
  } catch (ex) {
    logger.error(
      `${API_NAME}: [${req.method}] ${req.originalUrl}: reqId=${req.requestId}: ${ex}`
    );
    status = 500;
    errors.push(
      new ApiError(
        'CONTAINER-001',
        'Internal server error',
        `An error occurred while retrieving the containers: ${ex.message}`,
        `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CONTAINER-001`
      )
    );
  }
  res
    .status(status)
    .json(
      new ApiResult(
        status === 200 ? 'OK' : 'ERROR',
        containers,
        req.requestId,
        errors
      )
    );
});

/**
 * @swagger
 * /v1/client/{id}:
 *   get:
 *     tags:
 *       - Clients
 *     summary: Returns clients
 *     description: Returns all the clients
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the client to update
 *         schema:
 *           type: integer
 *         required: false
 *     responses:
 *       200:
 *         description: ApiResult object with all clients found in data attribute
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/ApiResult'
 */
router.get('/:id', async function(req, res, next) {
  let errors = [];
  let status = 200;
  let client = null;
  try {
    client = await clientService.getClient(req.params.id);
    if (client === undefined) {
      logger.error(
        `${API_NAME}: [${req.method}] ${req.originalUrl}: reqId=${req.requestId}: Client not found`
      );
      status = 404;
      errors.push(
        new ApiError(
          'CLIENT-001',
          'Incorrect Id, this id does not exist',
          'Ensure that the Id included in the request are correct',
          `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CLIENT-001`
        )
      );
    }
  } catch (ex) {
    logger.error(
      `${API_NAME}: [${req.method}] ${req.originalUrl}: reqId=${req.requestId}: ${ex}`
    );
    status = 500;
    errors.push(
      new ApiError(
        'CLIENT-001',
        'Internal server error',
        `An error occurred while retrieving the clients: ${ex.message}`,
        `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CLIENT-001`
      )
    );
  }

  res
    .status(status)
    .json(
      new ApiResult(
        status === 200 ? 'OK' : 'ERROR',
        client,
        req.requestId,
        errors
      )
    );
});

/**
 * @swagger
 * /v1/client:
 *   post:
 *     tags:
 *       - Clients
 *     summary: Creates a new client
 *     description: Creates a new client
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/schemas/Client'
 *     responses:
 *       201:
 *         description: ApiResult object with created client in data attribute
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/ApiResult'
 */

router.post('/', async function(req, res, next) {
  let errors = [];
  let clientCreated = null;
  let status = 201;
  try {
    clientCreated = await clientService.postClient(req.body);
    
  } catch (ex) {
    logger.error(`${API_NAME}: [${req.method}] ${req.originalUrl}: ${ex}`)
    status = 500;
    errors.push(new ApiError('CLIENT-001',
      'Internal server error', 
      ex.message, 
      `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CLIENT-001`));
  }
  res
    .status(status)
    .json(
      new ApiResult(
        status === 201 ? 'OK' : 'ERROR',
        clientCreated,
        req.requestId,
        errors
      )
    );
});

/**
 * @swagger
 * /v1/client/{id}:
 *   put:
 *     tags:
 *       - Clients
 *     summary: Updates a client
 *     description: Updates a client
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the client to update
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/schemas/Client'
 *     responses:
 *       200:
 *         description: ApiResult object with updated client in data attribute
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/ApiResult'
 */
router.put('/:id', async function(req, res, next) {
  logger.info(`About to update client id: ${req.params.id}`);
  let errors = [];
  let status = 200;
  let clientUpdated = null;
  
  try {
    const id = req.params.id;
    const clientNewData = req.body;

    if (!clientNewData) {
      logger.error(
        `${API_NAME}: [${req.method}] ${req.originalUrl}: reqId=${req.requestId} : Client not found`
      );
      status = 400;
      errors.push(
        new ApiError(
          'CLIENT-001',
          'Missing or invalid request body',
          'Ensure that the request body is not empty and is a valid client object',
          `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CLIENT-001`
        )
      );
      return res
        .status(400)
        .json(new ApiResult('ERROR', clientUpdated === undefined, errors));
    }

    clientUpdated = await clientService.putClient(id, clientNewData);
    if (clientUpdated === undefined) {
      logger.info(`About to client not exist id: ${req.params.id}`);
      logger.error(
        `${API_NAME}: [${req.method}] ${req.originalUrl}: reqId=${req.requestId} : Client not found`
      );
      status = 404;
      errors.push(
        new ApiError(
          'CLIENT-001',
          'Incorrect Id, this id does not exist',
          'Ensure that the Id included in the request is correct',
          `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CLIENT-001`
        )
      );
    }
  } catch (ex) {
    logger.error(`${API_NAME}: [${req.method}] ${req.originalUrl}: ${ex}`);
    status = 500;
    errors.push(new ApiError('CLIENT-001',
      'Internal server error',
      ex.message,
      `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CLIENT-001`));
    return res.status(500).json(new ApiResult("ERROR", clientUpdated === undefined, errors));
  }
  res
    .status(status)
    .json(
      new ApiResult(
        status === 200 ? 'OK' : 'ERROR',
        clientUpdated,
        req.requestId,
        errors
      )
    );
});

/**
 * @swagger
 * /v1/client/{id}:
 *   delete:
 *     tags:
 *       - Clients
 *     summary: Updates a client
 *     description: Updates a client
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the client to update
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: ApiResult object with deleted client in data attribute
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/ApiResult'
 */
router.delete('/:id', async function(req, res, next) {
  logger.info(`About to delete client id: ${req.params.id}`);
  let errors = [];
  let status = 200;
  let clientDeleted = null;
  try {
    const id = req.params.id;

    clientDeleted = await clientService.deleteClient(id);

    if (clientDeleted === undefined) {
      logger.info(`About to client not exist id: ${req.params.id}`);
      logger.error(
        `${API_NAME}: [${req.method}] ${req.originalUrl}:reqId=${req.requestId}: Client not found`
      );
      status = 404;
      errors.push(
        new ApiError(
          'CLIENT-001',
          'Incorrect Id, this id does not exist',
          'Ensure that the Id included in the request is correct',
          `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CLIENT-001`
        )
      );
    }
  } catch (ex) {
    logger.error(`${API_NAME}: [${req.method}] ${req.originalUrl}: ${ex}`);
    status = 500;
    errors.push(new ApiError('CLIENT-001',
      'Internal server error',
      ex.message,
      `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CLIENT-001`));
      return res.status(500).json(new ApiResult("ERROR", clientDeleted === undefined, errors));
  }
  res
    .status(status)
    .json(
      new ApiResult(
        status === 200 ? 'OK' : 'ERROR',
        clientDeleted,
        req.requestId,
        errors
      )
    );
});

module.exports = router;
