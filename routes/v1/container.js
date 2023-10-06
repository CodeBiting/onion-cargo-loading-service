const express = require('express');
const router = express.Router();

const logger = require('../../api/logger');
const ApiResult = require('../../api/ApiResult');
const ApiError = require('../../api/ApiError');
const containerService = require('../../api/v1/containerService');
const registerService = require('../../api/v1/registerService');

const reqQuery = require('../../api/requestQuery');
const volAnalysis = require('../../api/VolumeAnalysis');

let redisContainers = null;
require('dotenv').config();
if (process.env.HAS_REDIS) {
  const hostRedis = process.env.REDIS_HOST || 'localhost';
  const portRedis = process.env.REDIS_PORT || 6379;
  const redis = require('redis');
  redisContainers = redis.createClient({
    url: `redis://${hostRedis}:${portRedis}`
  });

  (async () => {
    await redisContainers.connect();
  })();

  redisContainers.on('connect', () => console.log('::> Redis Client Connected'));
  redisContainers.on('error', (err) => console.log('<:: Redis Client Error', err));
}

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
 *     description: Returns all the containers with limits
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: clientId
 *         description: Using the ClientId to search for his Containers
 *         schema:
 *           type: integer
 *         required: false
 *       - in: query
 *         name: skip
 *         description: Number of containers to skip
 *         schema:
 *           type: integer
 *         required: false
 *       - in: query
 *         name: limit
 *         description: max. number of elements to return
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
router.get('/', async function (req, res, next) {
  const errors = [];
  let status = 200;
  let containers = null;

  // logger.info(`test-message ${req.requestId}`);
  try {
    if (req.query.clientId) {
      containers = await containerService.getClientContainers(req.query.clientId, req.query.skip, req.query.limit);
    } else {
      const pag = reqQuery.pagination(req.query);
      const filter = reqQuery.filter(req.query);
      const sort = reqQuery.sort(req.query);
      containers = await containerService.getContainers(pag, filter, sort);
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
 *     summary: Return specific container
 *     description: Returns one container from ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         description: Using the container ID to perform a search
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: ApiResult object with all containers found in data attribute
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/ApiResult'
  */
router.get('/:id', async function (req, res, next) {
  const errors = [];
  let status = 200;
  let container = null;

  try {
    container = await containerService.getContainer(req.params.id);
    if (container === undefined) {
      logger.error(`${API_NAME}: [${req.method}] ${req.originalUrl}: Container not found`);
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
 * /v1/container/smallest/{clientId}:
 *   post:
 *     tags:
 *       - Containers
 *     summary: Return the smallest container
 *     description: Return the smallest container where your products can fit
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: clientId
 *         description: Using clientid to volumeAnalysis
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *     responses:
 *       200:
 *         description: ApiResult object with all containers found in data attribute
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/ApiResult'
  */
router.post('/smallest/:clientId', async function (req, res, next) {
  const errors = [];
  let status = 200;
  let smallestContainerFound = null;
  let container = null;
  let containers;

  try {
    if (redisContainers) {
      const reply = await redisContainers.get(`containersFrom${req.params.clientId}`);
      if (reply) {
        containers = JSON.parse(reply);
      } else {
        containers = await containerService.selectContainerForVolumeAnalysis(req.params.clientId);
        await redisContainers.set(`containersFrom${req.params.clientId}`, JSON.stringify(containers));
      }
    } else {
      containers = await containerService.selectContainerForVolumeAnalysis(req.params.clientId);
    }
    if(!containers || containers.length<=0){
      status = 404;
      const error = new ApiError(
            'CONTAINER-001',
            `Containers Not Found for client with ID ${req.params.clientId}`,
            '',
            `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CONTAINER-001`
          );
          const apiRes = new ApiResult(
            status === 200 ? 'OK' : 'ERROR',
            container,
            req.requestId,
            [error]
          );
          return res.status(status).json(apiRes);
    }
    smallestContainerFound = volAnalysis.findPickingBox(containers, req.body);
    if (smallestContainerFound) {
      if (smallestContainerFound.returnValue === 0) {
        container = [smallestContainerFound.boxFound];
      } else {
        status = 404;
        errors.push(
          new ApiError(
            'CONTAINER-001',
            'Smallest Container Not Found',
            smallestContainerFound.message,
            `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CONTAINER-001`
          ));
      }
    } else {
      throw new Error('Expected result for findPickingBox but not found');
    }
  } catch (ex) {
    logger.error(`${API_NAME}: [${req.method}] ${req.originalUrl}: reqId=${req.requestId}: ${ex}`);
    status = 500;
    errors.push(
      new ApiError(
        'CONTAINER-001',
        'Internal server error',
        ex.message,
        `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CONTAINER-001`
      )
    );
  }
  // console.log('A-2');
  const apiRes = new ApiResult(
    status === 200 ? 'OK' : 'ERROR',
    container,
    req.requestId,
    errors
  );
  // Add register
  const newRegister = {
    clientId: req.params.clientId,
    date: new Date(),
    origin: req._remoteAddress ? req._remoteAddress : 'Field not found in req',
    destiny: req.originalUrl ? req.originalUrl : 'Field not found in req',
    method: req.method ? req.method : 'Field not found in req',
    requestId: req.requestId ? req.requestId : 'Field not found in req',
    status,
    requestBody: JSON.stringify(req.body),
    responseData: JSON.stringify(apiRes)
  };
  // console.log('A-3');
  const registerCreated = await registerService.postRegister(newRegister);
  // console.log('A-4');
  if (registerCreated === undefined || registerCreated === null) {
    logger.error(
      `${API_NAME}: [${req.method}] ${req.originalUrl}: reqId=${req.requestId} : register not created`
    );
  } else {
    logger.info(
      `${API_NAME}: [${req.method}] ${req.originalUrl}: reqId=${req.requestId} : register created ok ${JSON.stringify(registerCreated)}`
    );
  }
  // console.log('A-5');
  res
    .status(status)
    .json(
      apiRes
    );
});

/**
 * @swagger
 * /v1/container:
 *   post:
 *     tags:
 *       - Containers
 *     summary: Add container
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
router.post('/', async function (req, res, next) {
  const errors = [];
  let status = 201;
  let containerCreated = null;

  try {
    containerCreated = await containerService.postContainer(req.body);
    if (containerCreated && redisContainers) await redisContainers.del(`containersFrom${req.body.clientId}`);
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
 *     summary: Update container
 *     description: Updates the data from container
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

router.put('/:id', async function (req, res, next) {
  logger.info(`About to update client id: ${req.params.id}`);
  const errors = [];
  let status = 200;
  let containerUpdated = null;

  try {
    const id = req.params.id;
    const containerNewData = req.body;

    containerUpdated = await containerService.putContainer(id, containerNewData);
    if (containerUpdated && redisContainers) await redisContainers.del(`containersFrom${containerUpdated.clientId}`);
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
    logger.error(`${API_NAME}: [${req.method}] ${req.originalUrl}: reqId=${req.requestId} : ${ex}`);
    // console.log(ex);
    status = 500;
    errors.push(new ApiError('CONTAINER-001',
      'Internal server error',
      'Server has an internal error with the request',
      `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CONTAINER-001`));
    return res.status(500).json(new ApiResult('ERROR', containerUpdated === undefined, errors));
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
 *     summary: Delete container
 *     description: Deletes a container with the ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the container to Delete
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
router.delete('/:id', async function (req, res, next) {
  const errors = [];
  let status = 200;
  let containerDeleted = null;

  try {
    const id = req.params.id;

    containerDeleted = await containerService.deleteContainer(id);
    if (containerDeleted && redisContainers) await redisContainers.del(`containersFrom${containerDeleted.clientId}`);
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
/**
 * @swagger
 * /v1/container/{id}/delete:
 *   put:
 *     tags:
 *       - Containers
 *     summary: Add delete date to container
 *     description: Deletes a container by ID but just adding a date
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the container to Delete
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
router.put('/:id/delete', async function (req, res, next) {
  const errors = [];
  let status = 200;
  let containerDeleted = null;

  try {
    containerDeleted = await containerService.desactivateContainer(req.params.id);
    if (containerDeleted && redisContainers) await redisContainers.del(`containersFrom${containerDeleted.clientId}`);
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
