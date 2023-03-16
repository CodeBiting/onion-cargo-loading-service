var express = require('express');
var router = express.Router();

const logger = require(`${__base}api/logger`);
const ApiResult = require(`${__base}api/ApiResult`);
const ApiError = require(`${__base}api/ApiError`);
const registerService = require(`${__base}api/v1/registerService`);

const HELP_BASE_URL = '/v1/help/error';

/**
 * @swagger
 *   definitions:
 *   Register:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       date:
 *         type: string
 *         format: date-time
 *       origin:
 *         type: string
 *       destiny: 
 *         type: string
 *         description: url of the server to ask
 *       method: 
 *         type: string
 *       status: 
 *         type: integer
 *      requestBody: 
 *          type: string
 *      responseData:
 *          type: string
  *     required: ["id", "date", "origin", "destiny", "method", "status"]
 */

/**
 * @swagger 
 * /v1/register:
 *   get:
 *     summary: Returns registers
 *     description: Returns all the registers
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: ApiResult object with all registers found in data attribute
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/ApiResult'
  */
router.get('/', function(req, res, next) {
  //logger.info(`About to update register id: ${req.params.id}`)
  let errors = [];
  let status = 200;
  let registers = null;
  try {
    registers = registerService.getRegisters();
  } catch (ex) {
    status = 500;
    errors.push(new ApiError('REGISTER-001', 
      'Internal server error',
      'Server has an internal error with the request', 
      `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/REGISTER-001`));
  }

  res.status(status).json(new ApiResult((status === 200 ? "OK" : "ERROR"), registers, errors));
});

/**
 * @swagger 
 * /v1/register/{id}:
 *   get:
 *     summary: Returns registers
 *     description: Returns one register
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the register to update
 *         schema:
 *           type: integer
 *         required: false
 *     responses:
 *       200:
 *         description: ApiResult object with all registers found in data attribute
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/ApiResult'
  */
router.get('/:id', function(req, res, next) {
  logger.info(`About to update register id: ${req.params.id}`)
  let errors = [];
  let status = 200;
  let register = null;
  try {
    register = registerService.getRegister(req.params.id);
    if (register === undefined) {  
      status = 404;
      errors.push(new ApiError('REGISTER-001', 
        'Incorrect Id, this id does not exist', 
        'Ensure that the Id included in the request are correct', 
        `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/REGISTER-001`));
    }
  } catch (ex) {
    status = 500;
    errors.push(new ApiError('REGISTER-001', 
      'Internal server error',
      'Server has an internal error with the request', 
      `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/REGISTER-001`));
  }

  res.status(status).json(new ApiResult((status === 200 ? "OK" : "ERROR"), register, errors));
});

/**
 * @swagger 
 * /v1/register:
 *   post:
 *     summary: Creates a new register
 *     description: Creates a new register
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: Container object
 *         description: The register to create
 *         schema:
 *           $ref: '#/definitions/Register'
 *     responses:
 *       200:
 *         description: ApiResult object with created register in data attribute
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/ApiResult'
 */
router.post('/', function(req, res, next) {
  let errors = [];
  try {
    let registerCreated = registerService.postRegister(req.body);
    //console.log(containerCreated);
    res.status(201).json(new ApiResult("OK", registerCreated, null));
  } catch (ex) {
    errors.push(new ApiError('REGISTER-001',
      'Internal server error', 
      'Server has an internal error with the request', 
      `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/REGISTER-001`));
    res.status(500).json(new ApiResult("ERROR", null, errors));
  }
});

/**
 * @swagger 
 * /v1/register/{id}:
 *   put:
 *     summary: Updates a register
 *     description: Updates a register
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the register to update
 *         schema:
 *           type: integer
 *         required: true
 *       - in: body
 *         name: Register object
 *         description: The register to update
 *         schema:
 *           $ref: '#/definitions/Register'
 *     responses:
 *       200:
 *         description: ApiResult object with updated register in data attribute
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
    const registerNewData = req.body;

    if (!registerNewData) {
      errors.push(new ApiError('CONTAINER-001',
        'Missing or invalid request body',
        'Ensure that the request body is not empty and is a valid register object',
        `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/REGISTER-001`));
      return res.status(400).json(new ApiResult("ERROR", null, errors));
    }

    const registerUpdate = registerService.putRegister(id, registerNewData);
    if (registerUpdate) {
      res.status(200).json(new ApiResult("OK", registerUpdate , null));
    } else {
      errors.push(new ApiError('REGISTER-001',
        'Incorrect Id, this id does not exist',
        'Ensure that the Id included in the request is correct',
        `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/REGISTER-001`));
      return res.status(404).json(new ApiResult("ERROR", null, errors));
    }
  } catch (ex) {
    errors.push(new ApiError('REGISTER-001',
      'Internal server error',
      'Server has an internal error with the request',
      `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/REGISTER-001`));
    return res.status(500).json(new ApiResult("ERROR", null, errors));
  }
});

/**
 * @swagger 
 * /v1/register/{id}:
 *   delete:
 *     summary: Updates a register
 *     description: Updates a register
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the register to update
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: ApiResult object with deleted register in data attribute
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/ApiResult'
 */
router.delete('/:id', function(req, res, next) {
  try {
    const id = req.params.id;

    const registerDeleted = registerService.deleteRegister(id);

    if (registerDeleted) {
      res.status(200).json(new ApiResult("OK", registerDeleted, null));
    } else {
      res.status(404).json(new ApiResult("ERROR", null, [{
        code: 'REGISTER-001',
        message: 'Incorrect Id, this id does not exist',
        detail: 'Ensure that the Id included in the request is correct',
        help: `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/REGISTER-001`
      }]));
    }
  } catch (ex) {
    res.status(500).json(new ApiResult("ERROR", null, [{
      code: 'REGISTER-001',
      message: 'Internal server error',
      detail: 'Server has an internal error with the request',
      help: `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/REGISTER-001`
    }]));
  }
});

module.exports = router;