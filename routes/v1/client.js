var express = require('express');
var router = express.Router();

const logger = require(`${__base}api/logger`);
const ApiResult = require(`${__base}api/ApiResult`);
const ApiError = require(`${__base}api/ApiError`);
const clientService = require(`${__base}api/v1/clientService`);

const HELP_BASE_URL = '/v1/help/error';

// Constants to structure logs
const API_NAME = 'client';

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
  *     required: ["id", "code"]
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
router.get('/', function(req, res, next) {
  let errors = [];
  let status = 200;
  let clients = null;
  try {
    clients = clientService.getClients();
  } catch (ex) {
    logger.error(`${API_NAME}: [${req.method}] ${req.originalUrl}: ${ex}`);
    status = 500;
    errors.push(new ApiError('CLIENT-001', 
      'Internal server error',
      'Server has an internal error with the request', 
      `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CLIENT-001`));
  }

  res.status(status).json(new ApiResult((status === 200 ? "OK" : "ERROR"), clients, errors));
});

/**
 * @swagger 
 * /v1/client/{id}:
 *   get:
 *     summary: Returns clients
 *     description: Returns one client
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
router.get('/:id', function(req, res, next) {
  let errors = [];
  let status = 200;
  let client = null;
  try {
    client = clientService.getClient(req.params.id);
    if (client === undefined) {
      logger.error(`${API_NAME}: [${req.method}] ${req.originalUrl}: Client not found`);
      status = 404;
      errors.push(new ApiError('CLIENT-001', 
        'Incorrect Id, this id does not exist', 
        'Ensure that the Id included in the request are correct', 
        `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CLIENT-001`));
    }
  } catch (ex) {
    logger.error(`${API_NAME}: [${req.method}] ${req.originalUrl}: ${ex}`)
    status = 500;
    errors.push(new ApiError('CLIENT-001', 
      'Internal server error',
      'Server has an internal error with the request', 
      `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CLIENT-001`));
  }

  res.status(status).json(new ApiResult((status === 200 ? "OK" : "ERROR"), client, errors));
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
router.post('/', function(req, res, next) {
  let errors = [];
  let status = 201;
  let clientCreated = null;

  try {
    clientCreated = clientService.postClient(req.body);
  } catch (ex) {
    logger.error(`${API_NAME}: [${req.method}] ${req.originalUrl}: ${ex}`);
    status=500;
    errors.push(new ApiError('CLIENT-001',
      'Internal server error', 
      'Server has an internal error with the request', 
      `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CLIENT-001`));
  }

  res.status(status).json(new ApiResult((status === 201 ? "OK" : "ERROR"), clientCreated, errors));
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
 *         description: The client to update
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
router.put('/:id', function(req, res, next) {
  let errors = [];
  let status = 200;
  let clientUpdated = null;

  try {
    clientUpdated = clientService.putClient(req.params.id, req.body);
    if (clientUpdated) {
      res.status(200).json(new ApiResult("OK", clientUpdated , null));
    } else {
      logger.error(`${API_NAME}: [${req.method}] ${req.originalUrl}: Client not found`);
      status=404;
      errors.push(new ApiError('CLIENT-001',
        'Incorrect Id, this id does not exist',
        'Ensure that the Id included in the request is correct',
        `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CLIENT-001`));
    }
  } catch (ex) {
    logger.error(`${API_NAME}: [${req.method}] ${req.originalUrl}: ${ex}`)
    status=500;
    errors.push(new ApiError('CLIENT-001',
      'Internal server error',
      'Server has an internal error with the request',
      `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CLIENT-001`));
  }

  res.status(status).json(new ApiResult((status === 200 ? "OK" : "ERROR"), clientUpdated, errors));
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
router.delete('/:id', function(req, res, next) {
  let errors = [];
  let status = 200;
  let clientDeleted = null;

  try {
    clientDeleted = clientService.deleteClient(req.params.id);
    if (clientDeleted === undefined) {
      logger.error(`${API_NAME}: [${req.method}] ${req.originalUrl}: Client not found`);
      status=404;
      errors.push(new ApiError(
        'CLIENT-001',
        'Incorrect Id, this id does not exist',
        'Ensure that the Id included in the request is correct',
        `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CLIENT-001`
      ));
    }
  } catch (ex) {
    logger.error(`${API_NAME}: [${req.method}] ${req.originalUrl}: ${ex}`)
    status=500;
    errors.push(new ApiError(
      'CLIENT-001',
      'Internal server error',
      'Server has an internal error with the request',
      `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CLIENT-001`
    ));
  }

  res.status(status).json(new ApiResult((status === 200 ? "OK" : "ERROR"), clientDeleted, errors));
});

module.exports = router;