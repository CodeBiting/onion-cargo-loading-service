const logger = require("../../api/logger");

module.exports = function () {

  let operations = {
    GET
  };

  function GET(req, res, next) {
    let healthchecks = [
      {
        result: 'ok',
      },
    ];
    res.status(200).json(healthchecks);
  }

  GET.apiDoc = {
    summary: "Performs health check.",
    operationId: "getHealthcheck",
    responses: {
      200: {
        description: "Performs health check.",
        schema: {
          type: "array",
          items: {
            $ref: "#/definitions/Healthcheck",
          },
        },
      },
    },
  };

  return operations;
};
