const express = require('express');
const router = express.Router();

const logger = require('../../api/logger');
const ApiResult = require('../../api/ApiResult');
const ApiError = require('../../api/ApiError');
const registerService = require('../../api/v1/registerService');
const reqQuery = require('../../api/requestQuery');

const HELP_BASE_URL = '/v1/help/error';

// Constants to structure logs
const API_NAME = 'register';

/**
 * @swagger
 * definitions:
 *   schemas:
 *     Register:
 *       tags:
 *         - Registers
 *       type: object
 *       properties:
 *         client_Id:
 *           type: integer
 *         date:
 *           type: string
 *           format: date-time
 *           description: DateTime when the call is received. In format 'YYYY-MM-DD hh:mm:ss' in local date time
 *           example: 2023-12-25 12:45:32
 *         origin:
 *           type: string
 *         destiny:
 *           type: string
 *           description: url of the server to ask
 *         method:
 *           type: string
 *         requestId:
 *           type: string
 *         status:
 *           type: integer
 *         requestBody:
 *           type: string
 *         responseData:
 *           type: string
 *       required: ["id", "date", "origin", "destiny", "method", "requestId"]
 */

/**
 * @swagger
 * /v1/register:
 *   get:
 *     tags:
 *       - Registers
 *     summary: Returns registers
 *     description: Returns all the registers with limits
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: query
 *         name: skip
 *         description: Number of containers to skip
 *         schema:
 *           type: integer
 *         required: false
 *       - in: query
 *         name: limit
 *         description: Max. number of elements to return
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
router.get('/', async function (req, res, next) {
  const errors = [];
  let status = 200;
  let registers = null;
  try {
    const pag = reqQuery.pagination(req.query);
    const filter = reqQuery.filter(req.query);
    const sort = reqQuery.sort(req.query);
    registers = await registerService.getRegisters(pag, filter, sort);
  } catch (ex) {
    logger.error(`${API_NAME}: [${req.method}] ${req.originalUrl}: reqId=${req.requestId}: ${ex}`);
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
        status === 200 ? 'OK' : 'ERROR',
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
 *     tags:
 *       - Registers
 *     summary: Returns specific register
 *     description: Returns one register from ID
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
 *         description: ApiResult object with all registers found in data attribute
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/ApiResult'
 */
router.get('/:id', async function (req, res, next) {
  const errors = [];
  let status = 200;
  let register = null;
  try {
    register = await registerService.getRegister(req.params.id);
    if (register === undefined) {
      status = 404;
      logger.error(`${API_NAME}: [${req.method}] ${req.originalUrl}: reqId=${req.requestId} : Register not found`);
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
    logger.error(`${API_NAME}: [${req.method}] ${req.originalUrl}: reqId=${req.requestId}:  Register not found`);
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
        status === 200 ? 'OK' : 'ERROR',
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
 *     tags:
 *       - Registers
 *     summary: Add register
 *     description: Creates a new register
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/schemas/Register'
 *     responses:
 *       201:
 *         description: ApiResult object with created register in data attribute
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/ApiResult'
 */
router.post('/', async function (req, res, next) {
  const errors = [];
  let status = 201;
  let registerCreated = null;

  try {
    registerCreated = await registerService.postRegister(req.body);
  } catch (ex) {
    logger.error(`${API_NAME}: [${req.method}] ${req.originalUrl}: ${ex}`);
    // console.log(ex);
    status = 500;
    errors.push(new ApiError('REGISTER-001',
      'Internal server error',
      ex.message,
      `${req.protocol}://${req.get('host')}${HELP_BASE_URL}/REGISTER-001`));
  }

  res
    .status(status)
    .json(
      new ApiResult(
        status === 201 ? 'OK' : 'ERROR',
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
 *     tags:
 *       - Registers
 *     summary: Updates register
 *     description: Updates the data from register
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the register to update
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/definitions/schemas/Register'
 *     responses:
 *       200:
 *         description: ApiResult object with updated register in data attribute
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/ApiResult'
 */
router.put('/:id', async function (req, res, next) {
  const errors = [];
  let status = 200;
  let registerUpdated = null;

  try {
    registerUpdated = await registerService.putRegister(req.params.id, req.body);
    if (registerUpdated === undefined) {
      logger.error(`${API_NAME}: [${req.method}] ${req.originalUrl}: reqId=${req.requestId} : Register not found`);
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
    logger.error(`${API_NAME}: [${req.method}] ${req.originalUrl}: reqId=${req.requestId}: ${ex}`);
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
        status === 200 ? 'OK' : 'ERROR',
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
 *     tags:
 *       - Registers
 *     summary: Delete register
 *     description: Delete a client register with the ID
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the register to delete
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
router.delete('/:id', async function (req, res, next) {
  const errors = [];
  let status = 200;
  let registerDeleted = null;

  try {
    registerDeleted = await registerService.deleteRegister(req.params.id);

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
        status === 200 ? 'OK' : 'ERROR',
        registerDeleted,
        req.requestId,
        errors
      )
    );
});

/**
 * @swagger
 * /v1/register/{id}/delete:
 *   put:
 *     tags:
 *       - Registers
 *     summary: Add delete date to register
 *     description: Delete a client register by ID but just adding a date
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the register to delete
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
router.put('/:id/delete', async function (req, res, next) {
  const errors = [];
  let status = 200;
  let registerDeleted = null;

  try {
    registerDeleted = await registerService.dateDeleteRegister(req.params.id);

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
        status === 200 ? 'OK' : 'ERROR',
        registerDeleted,
        req.requestId,
        errors
      )
    );
});

module.exports = router;
