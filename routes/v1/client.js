var express = require("express");
var router = express.Router();

const logger = require(`${__base}api/logger`);
const ApiResult = require(`${__base}api/ApiResult`);
const ApiError = require(`${__base}api/ApiError`);
const clientService = require(`${__base}api/v1/clientService`);
const containerService = require(`${__base}api/v1/containerService`);

const HELP_BASE_URL = "/v1/help/error";

// Constants to structure logs
const API_NAME = "client";

/**
 * @swagger
 *   definitions:
 *   Client:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       code:
 *         type: string
 *       dateStart:
 *         type: string
 *       dateFinal:
 *         type: string
 *       active:
 *         type: boolean
 *       token:
 *         type: string
 *       notes:
 *         type: string
 *     required: ["id", "code", "dateStart", "dateFinal", "active", "token", "notes"]
 */

/**
 * @swagger
 * /v1/client:
 *   get:
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
router.get('/', function (req, res, next) {
  let errors = [];
  let status = 200;
  let clients = null;
  try {
    clients = clientService.getClients();
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
        status === 200 ? "OK" : "ERROR",
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

router.get('/:id/containers', function (req, res, next) {
  let status = 200;
  let containers = null;
  let errors = [];
  try {
    containers = containerService.getClientContainers(req.params.id);
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
        status === 200 ? "OK" : "ERROR",
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
router.get('/:id', function (req, res, next) {
  let errors = [];
  let status = 200;
  let client = null;
  try {
    client = clientService.getClient(req.params.id);
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
        status === 200 ? "OK" : "ERROR",
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
 *     summary: Creates a new client
 *     description: Creates a new client
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: Client object
 *         description: The client to create
 *         schema:
 *           $ref: '#/definitions/Client'
 *     responses:
 *       200:
 *         description: ApiResult object with created client in data attribute
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/ApiResult'
 */

router.post('/', function (req, res, next) {
  let errors = [];
  let clientCreated = null;
  let status = 201;
  try {
    clientCreated = clientService.postClient(req.body);
  } catch (ex) {
    logger.error(
      `${API_NAME}: [${req.method}] ${req.originalUrl}: reqId=${req.requestId}: ${ex}`
    );
    status = 500;
    errors.push(
      new ApiError(
        'CLIENT-001',
        'Internal server error',
        'Server has an internal error with the request',
        `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CLIENT-001`
      )
    );
  }
  res
    .status(status)
    .json(
      new ApiResult(
        status === 201 ? "OK" : "ERROR",
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
 *       - in: body
 *         name: Client object
 *         descriptcontainerion: The client to update
 *         schema:
 *           $ref: '#/definitions/Client'
 *     responses:
 *       200:
 *         description: ApiResult object with updated client in data attribute
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/ApiResult'
 */
router.put('/:id', function (req, res, next) {
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
        .json(new ApiResult("ERROR", clientUpdated === undefined, errors));
    }

    clientUpdated = clientService.putClient(id, clientNewData);
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
    logger.error(
      `${API_NAME}: [${req.method}] ${req.originalUrl}: reqId=${req.requestId}: ${ex}`
    );
    status = 500;
    errors.push(
      new ApiError(
        'CLIENT-001',
        'Internal server error',
        'Server has an internal error with the request',
        `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CLIENT-001`
      )
    );
    return res
      .status(500)
      .json(new ApiResult("ERROR", clientUpdated === undefined, errors));
  }
  res
    .status(status)
    .json(
      new ApiResult(
        status === 200 ? "OK" : "ERROR",
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
router.delete('/:id', function (req, res, next) {
  logger.info(`About to delete client id: ${req.params.id}`);
  let errors = [];
  let status = 200;
  let clientDeleted = null;
  try {
    const id = req.params.id;

    clientDeleted = clientService.deleteClient(id);

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
    logger.error(
      `${API_NAME}: [${req.method}] ${req.originalUrl}: reqId=${req.requestId}: ${ex}`
    );
    status = 500;
    errors.push(
      new ApiError(
        'CLIENT-001',
        'Internal server error',
        'Server has an internal error with the request',
        `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CLIENT-001`
      )
    );
    return res
      .status(500)
      .json(new ApiResult("ERROR", clientUpdated === undefined, errors));
  }
  res
    .status(status)
    .json(
      new ApiResult(
        status === 200 ? "OK" : "ERROR",
        clientDeleted,
        req.requestId,
        errors
      )
    );
});

module.exports = router;
