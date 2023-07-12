var express = require('express');
var router = express.Router();

const logger = require(`${__base}api/logger`);
const ApiResult = require(`${__base}api/ApiResult`);
const ApiError = require(`${__base}api/ApiError`);
const helpData = require(`${__base}/api/v1/help.json`);

// Constants to structure logs
const API_NAME = 'help';

/**
 * @swagger
 *   definitions:
 *   schemas:
 *     Error:
 *       tags:
 *         - Help
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         code:
 *           type: string
 *         message:
 *           type: string
 *         detail:
 *           type: string
 */

/**
 * @swagger
 * /v1/help/error:
 *   get:
 *     tags:
 *       - Help
 *     summary: Returns all error helps
 *     description: Returns all error helps
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: ApiResult object with all error helps
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/ApiResult'
 */
router.get('/error/', function (req, res, next) {
  res.status(200).json(new ApiResult('OK', helpData, req.requestId, []));
});

/**
 * @swagger
 * /v1/help/error/code:
 *   get:
 *     tags:
 *       - Help
 *     summary: Returns one error helps
 *     description: Returns one error helps
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: code
 *         description: CODE of the herror to obtain help
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: ApiResult object with help
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/ApiResult'
 */
router.get('/error/:code', function (req, res, next) {
  let errors = [];
  let status = 200;
  let helpFound = null;

  try {
    helpFound = helpData.find((h) => h.code === req.params.code);
    if (helpFound === undefined) {
      logger.error(
        `${API_NAME}: [${req.method}] ${req.originalUrl}: reqId=${req.requestId}: Help not found`
      );
      status = 404;
      errors.push(
        new ApiError(
          'HELP-001',
          'Incorrect code, this code does not exist',
          'Ensure that the code included in the request are correct',
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
        'HELP-002',
        'Internal server error',
        'Server has an internal error with the request',
        
      )
    );
  }

  res
    .status(status)
    .json(
      new ApiResult(
        status === 200 ? 'OK' : 'ERROR',
        helpFound,
        req.requestId,
        errors
      )
    );
});

module.exports = router;
