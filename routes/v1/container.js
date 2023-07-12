var express = require('express');
var router = express.Router();

const logger = require(`${__base}api/logger`);
const ApiResult = require(`${__base}api/ApiResult`);
const ApiError = require(`${__base}api/ApiError`);
const containerService = require(`${__base}api/v1/containerService`);

const HELP_BASE_URL = '/v1/help/error';

// Constants to structure logs
const API_NAME = 'container';

/**
 * @swagger
 * definitions:
 *   schemas:
 *     Container:
 *       tags:
 *         - Containers
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: the container ID
 *         clientId:
 *           type: integer
 *         code:
 *           type: string
 *           description: the container code, must be unique for the client
 *         description:
 *           type: string
 *           description: the container description
 *         width:
 *           type: integer
 *           description: the container internal width in milimeters
 *           example: 100
 *         length:
 *           type: integer
 *           description: the container internal length in milimeters
 *           example: 1000
 *         height:
 *           type: integer
 *           description: the container internal height in milimeters
 *           example: 100
 *         maxWeight:
 *           type: integer
 *           description: the container maximum weight that can carry, in miligrams
 *           example: 100
 *       required: ['id', 'code', 'width', 'length', 'height', 'maxWeight']
 */

/**
 * @swagger
 * /v1/container:
 *   get:
 *     tags:
 *       - Containers
 *     summary: Returns containers
 *     description: Returns all the containers
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: ApiResult object with all containers found in data attribute
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/ApiResult'
 */
router.get('/', async function(req, res, next) {
  let errors = [];
  let status = 200;
  let containers = null;
  //logger.info(`test-message ${req.requestId}`);
  try {
    if (req.query.clientId) {
      containers = await containerService.getClientContainers(req.query.clientId);
    } else {
      containers = await containerService.getContainers();
    }
  } catch (ex) {
    logger.error(`${API_NAME}: [${req.method}] ${req.originalUrl}: reqId=${req.requestId}: ${ex}`);
    status = 500;
    errors.push(
      new ApiError(
        'CONTAINER-001',
        'Internal server error',
        'Server has an internal error with the request',
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
 * /v1/container/{id}:
 *   get:
 *     tags:
 *       - Containers
 *     summary: Returns containers
 *     description: Returns one container
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
 *         description: ApiResult object with all containers found in data attribute
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/ApiResult'
  */
router.get('/:id', async function(req, res, next) {
  let errors = [];
  let status = 200;
  let container = null;
  try {
    container = await containerService.getContainer(req.params.id);
    if (container === undefined) {  
      logger.error(`${API_NAME}: [${req.method}] ${req.originalUrl}: Container not found`)
      status = 404;
      errors.push(
        new ApiError(
          'CONTAINER-001',
          'Incorrect Id, this id does not exist',
          'Ensure that the Id included in the request are correct',
          `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CONTAINER-001`
        )
      );
    }
  } catch (ex) {
    logger.error(`${API_NAME}: [${req.method}] ${req.originalUrl}: reqId=${req.requestId} : ${ex}`);
    status = 500;
    errors.push(
      new ApiError(
        'CONTAINER-001',
        'Internal server error',
        'Server has an internal error with the request',
        `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CONTAINER-001`
      )
    );
  }

  res
    .status(status)
    .json(
      new ApiResult(
        status === 200 ? 'OK' : 'ERROR',
        container,
        req.requestId,
        errors
      )
    );
});

/**
 * @swagger
 * /v1/container:
 *   post:
 *     tags:
 *       - Containers
 *     summary: Creates a new container
 *     description: Creates a new container
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/schemas/Container'
 *     responses:
 *       201:
 *         description: ApiResult object with created container in data attribute
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/ApiResult'
 */
router.post('/', async function(req, res, next) {
  let errors = [];
  let status = 201;
  let containerCreated = null;
  
  try {
    containerCreated = await containerService.postContainer(req.body);
  } catch (ex) {
    logger.error(
      `${API_NAME}: [${req.method}] ${req.originalUrl}: reqId=${req.requestId} : ${ex}`
    );
    status = 500;
    errors.push(new ApiError('CONTAINER-001',
      'Internal server error', 
      ex.message, 
      `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CONTAINER-001`));
  }

  res
    .status(status)
    .json(
      new ApiResult(
        status === 201 ? 'OK' : 'ERROR',
        containerCreated,
        req.requestId,
        errors
      )
    );
});

/**
 * @swagger
 * /v1/container/{id}:
 *   put:
 *     tags:
 *       - Containers
 *     summary: Updates a container
 *     description: Updates a container
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the container to update
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/schemas/Container'
 *     responses:
 *       200:
 *         description: ApiResult object with updated container in data attribute
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
  let containerUpdated = null;

  try {
    const id = req.params.id;
    const containerNewData = req.body;

    containerUpdated = await containerService.putContainer(id, containerNewData);
    if (containerUpdated === undefined) {
      logger.error(
        `${API_NAME}: [${req.method}] ${req.originalUrl}: reqId=${req.requestId} : Container not found`
      );
      status = 404;
      errors.push(
        new ApiError(
          'CONTAINER-001',
          'Incorrect Id, this id does not exist',
          'Ensure that the Id included in the request is correct',
          `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CONTAINER-001`
        )
      );
    }
  } catch (ex) {
    logger.error(`${API_NAME}: [${req.method}] ${req.originalUrl}: reqId=${req.requestId} : ${ex}`)
    //console.log(ex);
    status = 500;
    errors.push(new ApiError('CONTAINER-001',
      'Internal server error',
      'Server has an internal error with the request',
      `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CONTAINER-001`));
    return res.status(500).json(new ApiResult("ERROR", containerUpdated === undefined, errors));
  }

  res
    .status(status)
    .json(
      new ApiResult(
        status === 200 ? 'OK' : 'ERROR',
        containerUpdated,
        req.requestId,
        errors
      )
    );
});

/**
 * @swagger
 * /v1/container/{id}:
 *   delete:
 *     tags:
 *       - Containers
 *     summary: Updates a container
 *     description: Updates a container
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the container to update
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: ApiResult object with deleted container in data attribute
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/ApiResult'
 */
router.delete('/:id', async function(req, res, next) {
  let errors = [];
  let status = 200;
  let containerDeleted = null;

  try {
    const id = req.params.id;

    containerDeleted = await containerService.deleteContainer(id);
    if (containerDeleted === undefined) {
      logger.error(
        `${API_NAME}: [${req.method}] ${req.originalUrl}: reqId=${req.requestId} : Container not found`
      );
      status = 404;
      errors.push(
        new ApiError(
          'CONTAINER-001',
          'Incorrect Id, this id does not exist',
          'Ensure that the Id included in the request is correct',
          `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CONTAINER-001`
        )
      );
    }
  } catch (ex) {
    logger.error(
      `${API_NAME}: [${req.method}] ${req.originalUrl}: reqId=${req.requestId} : ${ex}`
    );
    status = 500;
    errors.push(
      new ApiError(
        'CONTAINER-001',
        'Internal server error',
        'Server has an internal error with the request',
        `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CONTAINER-001`
      )
    );
  }

  res
    .status(status)
    .json(
      new ApiResult(
        status === 200 ? 'OK' : 'ERROR',
        containerDeleted,
        req.requestId,
        errors
      )
    );
});

module.exports = router;
