var express = require('express');
var router = express.Router();

const logger = require(`../../api/logger`);
const ApiResult = require(`../../api/ApiResult`);
const ApiError = require(`../../api/ApiError`);
const containerService = require(`../../api/v1/containerService`);

const HELP_BASE_URL = '/help/error';

const API_NAME = 'container';

/**
 * @swagger
 * definitions:
 *   schemas:
 *     Healthcheck:
 *       tags:
 *         - Healthcheck
 *       type: object
 *       properties:
 *         number:
 *           type: integer
 *         code:
 *           type: string
 *         description:
 *           type: string,
 *       required: ['number', 'code']
 */

/**
 * @swagger
 * /v1/healthcheck:
 *   get:
 *     tags:
 *       - Healthcheck
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: ApiResult object with all healthchecks performed in data attribute
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#/definitions/ApiResult'
 */

router.get('/', function (req, res, next) {
  let errors = [];
  let status = 200;
  let container = null;
  try {
    //The call is correct when return status code 200 or 404 and incorrect when return 500
    //When return 200 or 404 the container is running, its not important the return of the information
    container = containerService.getContainer(1);
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
        container,
        req.requestId,
        errors
      )
    );
});

module.exports = router;
