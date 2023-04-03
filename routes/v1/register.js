var express = require("express");
var router = express.Router();

const logger = require(`${__base}api/logger`);
const ApiResult = require(`${__base}api/ApiResult`);
const ApiError = require(`${__base}api/ApiError`);
const registerService = require(`${__base}api/v1/registerService`);

const HELP_BASE_URL = "/v1/help/error";

// Constants to structure logs
const API_NAME = "register";

/**
 * @swagger
 *   definitions:
 *     Register:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         date:
 *           type: string
 *           format: date-time
 *         origin:
 *           type: string
 *         destiny:
 *           type: string
 *           description: url of the server to ask
 *         method:
 *           type: string
 *         status:
 *           type: integer
 *         requestBody:
 *           type: string
 *         responseData:
 *           type: string
 *       required: ["id", "date", "origin", "destiny", "method", "status"]
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
router.get('/', function (req, res, next) {
  let errors = [];
  let status = 200;
  let registers = null;
  try {
    registers = registerService.getRegisters();
  } catch (ex) {
    logger.error(
      `${API_NAME}: [${req.method}] ${req.originalUrl}: reqId=${req.requestId}: ${ex}`
    );
    status = 500;
    errors.push(
      new ApiError(
        'REGISTER-001',
        'Internal server error',
        'Server has an internal error with the request',
        `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/REGISTER-001`
      )
    );
  }

  res
    .status(status)
    .json(
      new ApiResult(
        status === 200 ? "OK" : "ERROR",
        registers,
        req.requestId,
        errors
      )
    );
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
router.get('/:id', function (req, res, next) {
  let errors = [];
  let status = 200;
  let register = null;
  try {
    register = registerService.getRegister(req.params.id);
    if (register === undefined) {
      status = 404;
      logger.error(
        `${API_NAME}: [${req.method}] ${req.originalUrl}: reqId=${req.requestId} : Register not found`
      );
      errors.push(
        new ApiError(
          'REGISTER-001',
          'Incorrect Id, this id does not exist',
          'Ensure that the Id included in the request are correct',
          `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/REGISTER-001`
        )
      );
    }
  } catch (ex) {
    logger.error(
      `${API_NAME}: [${req.method}] ${req.originalUrl}: reqId=${req.requestId}:  Register not found`
    );
    status = 500;
    errors.push(
      new ApiError(
        'REGISTER-001',
        'Internal server error',
        'Server has an internal error with the request',
        `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/REGISTER-001`
      )
    );
  }

  res
    .status(status)
    .json(
      new ApiResult(
        status === 200 ? "OK" : "ERROR",
        register,
        req.requestId,
        errors
      )
    );
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
router.post('/', function (req, res, next) {
  let errors = [];
  let status = 201;
  let registerCreated = null;

  try {
    registerCreated = registerService.postRegister(req.body);
  } catch (ex) {
    logger.error(
      `${API_NAME}: [${req.method}] ${req.originalUrl}: reqId=${req.requestId}: ${ex}`
    );
    errors.push(
      new ApiError(
        'REGISTER-001',
        'Internal server error',
        'Server has an internal error with the request',
        `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/REGISTER-001`
      )
    );
  }

  res
    .status(status)
    .json(
      new ApiResult(
        status === 201 ? "OK" : "ERROR",
        registerCreated,
        req.requestId,
        errors
      )
    );
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
router.put('/:id', function (req, res, next) {
  let errors = [];
  let status = 200;
  let registerUpdated = null;

  try {
    registerUpdated = registerService.putRegister(req.params.id, req.body);
    if (registerUpdated === undefined) {
      logger.error(
        `${API_NAME}: [${req.method}] ${req.originalUrl}: reqId=${req.requestId} : Register not found`
      );
      status = 404;
      errors.push(
        new ApiError(
          'REGISTER-001',
          'Incorrect Id, this id does not exist',
          'Ensure that the Id included in the request is correct',
          `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/REGISTER-001`
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
        'REGISTER-001',
        'Internal server error',
        'Server has an internal error with the request',
        `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/REGISTER-001`
      )
    );
  }

  res
    .status(status)
    .json(
      new ApiResult(
        status === 200 ? "OK" : "ERROR",
        registerUpdated,
        req.requestId,
        errors
      )
    );
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
router.delete('/:id', function (req, res, next) {
  let errors = [];
  let status = 200;
  let registerDeleted = null;

  try {
    registerDeleted = registerService.deleteRegister(req.params.id);

    if (registerDeleted === undefined) {
      logger.error(
        `${API_NAME}: [${req.method}] ${req.originalUrl}:reqId=${req.requestId}: Register not found`
      );
      status = 404;
      errors.push(
        new ApiError(
          'REGISTER-001',
          'Incorrect Id, this id does not exist',
          'Ensure that the Id included in the request is correct',
          `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/REGISTER-001`
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
        'REGISTER-001',
        'Internal server error',
        'Server has an internal error with the request',
        `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/REGISTER-001`
      )
    );
  }

  res
    .status(status)
    .json(
      new ApiResult(
        status === 200 ? "OK" : "ERROR",
        registerDeleted,
        req.requestId,
        errors
      )
    );
});

module.exports = router;
