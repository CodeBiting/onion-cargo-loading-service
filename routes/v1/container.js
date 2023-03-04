var express = require('express');
var router = express.Router();

const logger = require(`${__base}api/logger`);
const ApiResult = require(`${__base}api/ApiResult`);
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
 *     description: If query parameter is specified returns one container else returns all the containers
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
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
router.get('/', function(req, res, next) {
  //logger.info(`About to update container id: ${req.query.id}`)
  try {
    if (req.query.id === undefined) {
      let containers = containerService.getContainers();
      res.status(200).json(new ApiResult("OK", containers, null));
    } else if (req.query.id === "") {
      res.status(404).json(new ApiResult("ERROR", null, [{
        code:'CONTAINER-001',
        message:'Input Id empty',
        detail: 'Ensure that the input Id is not empty', 
        help:`${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CONTAINER-001`}]));
    } else {
      let container = containerService.getContainer(req.query.id);
      if (container === undefined) {  
        res.status(404).json(new ApiResult("ERROR", null, [{
          code:'CONTAINER-001',
          message:'Incorrect Id, this id does not exist', 
          detail: 'Ensure that the Id included in the request are correct', 
          help:`${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CONTAINER-001`}]));
      } else {
        res.status(200).json(new ApiResult("OK", container, null));
      }
    }
  } catch (ex) {
    res.status(500).json(new ApiResult("ERROR", null, [{
      code :'CONTAINER-001',
      message:  'Internal server error', 
      detail: 'Server has an internal error with the request', 
      help:`${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CONTAINER-001`}]));
  }
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
  try {
    let newContainer = req.body;
    let containerCreated = containerService.postContainer(newContainer);
    console.log(containerCreated);
    res.status(201).json(new ApiResult("OK", containerCreated, null));
  } catch (ex) {
    res.status(500).json(new ApiResult("ERROR", null, [{
      code :'CONTAINER-001',
      message:  'Internal server error', 
      detail: 'Server has an internal error with the request', 
      help:`${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CONTAINER-001`}]));
  }
});

/**
 * @swagger 
 * /v1/container:
 *   put:
 *     summary: Updates a container
 *     description: Updates a container
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
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
router.put('/', function(req, res, next) {
  try {
    if (!req.query.id || req.query.id === "") {
      res.status(404).json(new ApiResult("ERROR", null, [{
        code: 'CONTAINER-001',
        message: 'Input Id empty',
        detail: 'Ensure that the input Id is not empty',
        help: `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CONTAINER-001`
      }]));
      return;
    }

    //console.log(`PUT body ${req.body}`);

    const id = req.query.id;
    const container = containerService.getContainer(id);

    if (!container) {
      res.status(404).json(new ApiResult("ERROR", null, [{
        code: 'CONTAINER-001',
        message: 'Incorrect Id, this id does not exist',
        detail: 'Ensure that the Id included in the request are correct',
        help: `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CONTAINER-001`
      }]));
      return;
    }

    const containerNewData = req.body;

    if (!containerNewData) {
      res.status(400).json(new ApiResult("ERROR", null, [{
        code: 'CONTAINER-001',
        message: 'Missing or invalid request body',
        detail: 'Ensure that the request body is not empty and is a valid container object',
        help: `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CONTAINER-001`
      }]));
      return;
    }

    const containerUpdated = containerService.putContainer(id, containerNewData);

    if (containerUpdated) {
      res.status(200).json(new ApiResult("OK", containerUpdated , null));
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

/**
 * @swagger 
 * /v1/container:
 *   delete:
 *     summary: Updates a container
 *     description: Updates a container
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
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
router.delete('/', function(req, res, next) {
  try {
    if (!req.query.id || req.query.id === "") {
      res.status(404).json(new ApiResult("ERROR", null, [{
        code: 'CONTAINER-001',
        message: 'Input Id empty',
        detail: 'Ensure that the input Id is not empty',
        help: `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CONTAINER-001`
      }]));
      return;
    }

    const id = req.query.id;
    const container = containerService.getContainer(id);

    if (!container) {
      res.status(404).json(new ApiResult("ERROR", null, [{
        code: 'CONTAINER-001',
        message: 'Incorrect Id, this id does not exist',
        detail: 'Ensure that the Id included in the request are correct',
        help: `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/CONTAINER-001`
      }]));
      return;
    }

    const success = containerService.deleteContainer(id);

    if (success) {
      res.status(200).json(new ApiResult("OK", null, null));
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