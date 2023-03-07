var express = require('express');
var router = express.Router();

const logger = require(`${__base}api/logger`);
const ApiResult = require(`${__base}api/ApiResult`);
const ApiError = require(`${__base}api/ApiError`);
const containerService = require(`${__base}api/v1/containerService`);

const HELP_BASE_URL = '/v1/help/error';

/**
 * @swagger
 *   definitions:
 *   Container:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       code:
 *         type: string
 *       description:
 *         type: string
 *       width:
 *         type: integer
 *       length:
 *         type: integer
 *       height:
 *         type: integer
 *       maxWeight:
 *         type: integer
  *     required: ["id", "code", "width", "length", "height", "maxWeight"]
 */

/**
 * @swagger 
 * /v1/container:
 *   get:
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
router.get('/', function(req, res, next) {
  //logger.info(`About to update container id: ${req.params.id}`)
  let errors = [];
  let status = 200;
  let containers = null;
  try {
    containers = containerService.getContainers();
  } catch (ex) {
    status = 500;
    errors.push(new ApiError('CONTAINER-001', 
      'Internal server error',
      'Server has an internal error with the request', 
      `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CONTAINER-001`));
  }

  res.status(status).json(new ApiResult((status === 200 ? "OK" : "ERROR"), containers, errors));
});

/**
 * @swagger 
 * /v1/container/{id}:
 *   get:
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
router.get('/:id', function(req, res, next) {
  logger.info(`About to update container id: ${req.params.id}`)
  let errors = [];
  let status = 200;
  let container = null;
  try {
    container = containerService.getContainer(req.params.id);
    if (container === undefined) {  
      status = 404;
      errors.push(new ApiError('CONTAINER-001', 
        'Incorrect Id, this id does not exist', 
        'Ensure that the Id included in the request are correct', 
        `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CONTAINER-001`));
    }
  } catch (ex) {
    status = 500;
    errors.push(new ApiError('CONTAINER-001', 
      'Internal server error',
      'Server has an internal error with the request', 
      `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CONTAINER-001`));
  }

  res.status(status).json(new ApiResult((status === 200 ? "OK" : "ERROR"), container, errors));
});

/**
 * @swagger 
 * /v1/container:
 *   post:
 *     summary: Creates a new container
 *     description: Creates a new container
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: Container object
 *         description: The container to create
 *         schema:
 *           $ref: '#/definitions/Container'
 *     responses:
 *       200:
 *         description: ApiResult object with created container in data attribute
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/ApiResult'
 */
router.post('/', function(req, res, next) {
  let errors = [];
  try {
    let containerCreated = containerService.postContainer(req.body);
    //console.log(containerCreated);
    res.status(201).json(new ApiResult("OK", containerCreated, null));
  } catch (ex) {
    errors.push(new ApiError('CONTAINER-001',
      'Internal server error', 
      'Server has an internal error with the request', 
      `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CONTAINER-001`));
    res.status(500).json(new ApiResult("ERROR", null, errors));
  }
});

/**
 * @swagger 
 * /v1/container/{id}:
 *   put:
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
 *       - in: body
 *         name: Container object
 *         description: The container to update
 *         schema:
 *           $ref: '#/definitions/Container'
 *     responses:
 *       200:
 *         description: ApiResult object with updated container in data attribute
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
    const containerNewData = req.body;

    if (!containerNewData) {
      errors.push(new ApiError('CONTAINER-001',
        'Missing or invalid request body',
        'Ensure that the request body is not empty and is a valid container object',
        `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CONTAINER-001`));
      return res.status(400).json(new ApiResult("ERROR", null, errors));
    }

    const containerUpdated = containerService.putContainer(id, containerNewData);
    if (containerUpdated) {
      res.status(200).json(new ApiResult("OK", containerUpdated , null));
    } else {
      errors.push(new ApiError('CONTAINER-001',
        'Incorrect Id, this id does not exist',
        'Ensure that the Id included in the request is correct',
        `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CONTAINER-001`));
      return res.status(404).json(new ApiResult("ERROR", null, errors));
    }
  } catch (ex) {
    errors.push(new ApiError('CONTAINER-001',
      'Internal server error',
      'Server has an internal error with the request',
      `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CONTAINER-001`));
    return res.status(500).json(new ApiResult("ERROR", null, errors));
  }
});

/**
 * @swagger 
 * /v1/container/{id}:
 *   delete:
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
router.delete('/:id', function(req, res, next) {
  try {
    const id = req.params.id;

    const containerDeleted = containerService.deleteContainer(id);

    if (containerDeleted) {
      res.status(200).json(new ApiResult("OK", containerDeleted, null));
    } else {
      res.status(404).json(new ApiResult("ERROR", null, [{
        code: 'CONTAINER-001',
        message: 'Incorrect Id, this id does not exist',
        detail: 'Ensure that the Id included in the request is correct',
        help: `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CONTAINER-001`
      }]));
    }
  } catch (ex) {
    res.status(500).json(new ApiResult("ERROR", null, [{
      code: 'CONTAINER-001',
      message: 'Internal server error',
      detail: 'Server has an internal error with the request',
      help: `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CONTAINER-001`
    }]));
  }
});

module.exports = router;