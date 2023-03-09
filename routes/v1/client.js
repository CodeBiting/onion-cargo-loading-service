var express = require('express');
var router = express.Router();

const logger = require(`${__base}api/logger`);
const ApiResult = require(`${__base}api/ApiResult`);
const ApiError = require(`${__base}api/ApiError`);
const clientService = require(`${__base}api/v1/clientService`);

const HELP_BASE_URL = '/v1/help/error';

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
  //logger.info(`About to update client id: ${req.params.id}`)
  let errors = [];
  let status = 200;
  let clients = null;
  try {
    clients = clientService.getClients();
  } catch (ex) {
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
 *   /v1/client/[clientId]/containers:
 */

router.get('/v1/client/:clientId/containers', function(req, res, next) {
  //logger.info(`About to update client id: ${req.params.id}`)
  let errors = [];
  let status = 200;
  let containers = null;
  try {
    containers = containerService.getClientContainers(req.params.clientId);
  } catch (ex) {
    status = 500;
    errors.push(new ApiError('CLIENT-001', 
      'Internal server error',
      'Server has an internal error with the request', 
      `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CLIENT-001`));
  }

  res.status(status).json(new ApiResult((status === 200 ? "OK" : "ERROR"), containers, errors));
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
  logger.info(`About to update client id: ${req.params.id}`)
  let errors = [];
  let status = 200;
  let client = null;
  try {
    client = clientService.getClient(req.params.id);
    if (client === undefined) {  
      status = 404;
      errors.push(new ApiError('CLIENT-001', 
        'Incorrect Id, this id does not exist', 
        'Ensure that the Id included in the request are correct', 
        `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CLIENT-001`));
    }
  } catch (ex) {
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
 *   /v1/client/[clientId]/containers:
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

router.post('/', function(req, res, next) {
  let errors = [];
  try {
    let clientCreated = clientService.postClient(req.body);
    //console.log(clientCreated);
    res.status(201).json(new ApiResult("OK", clientCreated, null));
  } catch (ex) {
    errors.push(new ApiError('CLIENT-001',
      'Internal server error', 
      'Server has an internal error with the request', 
      `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CLIENT-001`));
    res.status(500).json(new ApiResult("ERROR", null, errors));
  }
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

  try {
    const id = req.params.id;
    const clientNewData = req.body;

    if (!clientNewData) {
      errors.push(new ApiError('CLIENT-001',
        'Missing or invalid request body',
        'Ensure that the request body is not empty and is a valid client object',
        `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CLIENT-001`));
      return res.status(400).json(new ApiResult("ERROR", null, errors));
    }

    const clientUpdated = clientService.putClient(id, clientNewData);
    if (clientUpdated) {
      res.status(200).json(new ApiResult("OK", clientUpdated , null));
    } else {
      errors.push(new ApiError('CLIENT-001',
        'Incorrect Id, this id does not exist',
        'Ensure that the Id included in the request is correct',
        `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CLIENT-001`));
      return res.status(404).json(new ApiResult("ERROR", null, errors));
    }
  } catch (ex) {
    errors.push(new ApiError('CLIENT-001',
      'Internal server error',
      'Server has an internal error with the request',
      `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CLIENT-001`));
    return res.status(500).json(new ApiResult("ERROR", null, errors));
  }
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
  try {
    const id = req.params.id;

    const clientDeleted = clientService.deleteClient(id);

    if (clientDeleted) {
      res.status(200).json(new ApiResult("OK", clientDeleted, null));
    } else {
      res.status(404).json(new ApiResult("ERROR", null, [{
        code: 'CLIENT-001',
        message: 'Incorrect Id, this id does not exist',
        detail: 'Ensure that the Id included in the request is correct',
        help: `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CLIENT-001`
      }]));
    }
  } catch (ex) {
    res.status(500).json(new ApiResult("ERROR", null, [{
      code: 'CLIENT-001',
      message: 'Internal server error',
      detail: 'Server has an internal error with the request',
      help: `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CLIENT-001`
    }]));
  }
});

module.exports = router;