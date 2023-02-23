const logger = require("../../api/logger");
const ApiResult = require("../../api/ApiResult");


module.exports = function (containerService) {

  let operations = {
    GET,
    POST,
    PUT,
    DELETE,
  };

  function GET(req, res, next) {
    //logger.info(`About to update container id: ${req.query.id}`)
    try {
      //Comprovem que l'Id no ha estat proporcionat
      if (req.query.id === undefined) {
        // Retornem tots els contenidors
        let containers = containerService.getContainers();
        res.status(200).json(new ApiResult("OK", containers, null));
        //Comprovem que l'Id no estigui buit
      } else if (req.query.id === "") {
        res.status(404).json(new ApiResult("ERROR", null, [{
          code:'CONTAINER-001',
          message:'Input Id empty',
          detail: 'Ensure that the input Id is not empty', 
          help:'https://example.com/help/error/CONTAINER-001'}]));
      } else {
        // Retornem un contenidor concret
        let container = containerService.getContainer(req.query.id);
        if (container === undefined) {  
          res.status(404).json(new ApiResult("ERROR", null, [{
            code:'CONTAINER-001',
            message:'Incorrect Id, this id does not exist', 
            detail: 'Ensure that the Id included in the request are correct', 
            help:'https://example.com/help/error/CONTAINER-001'}]));
        } else {
          res.status(200).json(new ApiResult("OK", container, null));
        }
      }
    } catch (ex) {
      res.status(500).json(new ApiResult("ERROR", null, [{
        code :'CONTAINER-001',
        message:  'Internal server error', 
        detail: 'Server has an internal error with the request', 
        help:'https://example.com/help/error/CONTAINER-001'}]));
    }
  }

  function POST(req, res, next) {
    logger.info(`About to create container: ${JSON.stringify(req.body)}`);
    res.status(201).json();
  }

  function PUT(req, res, next) {
    logger.info(`About to update container id: ${req.query.id}`);
    res.status(200).json();
  }

  function DELETE(req, res, next) {
    logger.info(`About to delete container id: ${req.query.id}`);
    res.status(200).json();
  }

  GET.apiDoc = {
    summary: "Fetch containers.",
    operationId: "getContainers",
    responses: {
      200: {
        description: "List of containers.",
        schema: {
          type: "array",
          items: {
            $ref: "#/definitions/Container",
          },
        },
      },
    },
  };

  POST.apiDoc = {
    summary: "Create container.",
    operationId: "createContainer",
    consumes: ["application/json"],
    parameters: [
      {
        in: "body",
        name: "container",
        schema: {
          $ref: "#/definitions/Container",
        },
      },
    ],
    responses: {
      201: {
        description: "Created",
      },
      400: {
        description: "Bad request",
      }, 
      404: {
        description: "Not found",
      }
    },
  };

  PUT.apiDoc = {
    summary: "Update container.",
    operationId: "updateContainer",
    parameters: [
      {
        in: "query",
        name: "id",
        required: true,
        type: "integer",
      },
      {
        in: "body",
        name: "container",
        schema: {
          $ref: "#/definitions/Container",
        },
      },
    ],
    responses: {
      200: {
        description: "Updated ok",
      },
    },
  };

  DELETE.apiDoc = {
    summary: "Delete container.",
    operationId: "deleteContainer",
    consumes: ["application/json"],
    parameters: [
      {
        in: "query",
        name: "id",
        required: true,
        type: "integer",
      },
    ],
    responses: {
      200: {
        description: "Delete",
      },
    },
  };

  return operations;
};
