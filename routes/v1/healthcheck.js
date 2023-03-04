var express = require('express');
var router = express.Router();

const logger = require(`${__base}api/logger`);
const ApiResult = require(`${__base}api/ApiResult`);

const HELP_BASE_URL = '/help/error';

/**
 * @swagger
 *   definitions:
 *     Healthcheck:
 *       type: object
 *       properties:
 *         number:
 *           type: integer
  *         code:
 *           type: string
 *         description:
 *           type: string,
 *       required: ["number", "code"]
 */

/**
 * @swagger 
 * /v1/healthcheck:
 *   get:
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
router.get('/', function(req, res, next) {
  let healthchecks = [
    {
      result: 'ok',
    },
  ];
  res.status(200).json(new ApiResult("OK", healthchecks, null));
});

module.exports = router;
