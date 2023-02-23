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
      if (req.query.id === undefined) {
        let containers = containerService.getContainers();
        res.status(200).json(new ApiResult("OK", containers, null));
      } else if (req.query.id === "") {
        res.status(404).json(new ApiResult("ERROR", null, [{
          code:'CONTAINER-001',
          message:'Input Id empty',
          detail: 'Ensure that the input Id is not empty', 
          help:'https://example.com/help/error/CONTAINER-001'}]));
      } else {
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
    try {
      let newContainer = req.body;
      containerService.postContainer(newContainer);
      res.status(201).json(new ApiResult("OK", newContainer, null));
    } catch (ex) {
      res.status(500).json(new ApiResult("ERROR", null, [{
        code :'CONTAINER-001',
        message:  'Internal server error', 
        detail: 'Server has an internal error with the request', 
        help:'https://example.com/help/error/CONTAINER-001'}]));
    }
  }
  

  function PUT(req, res, next) {
    try {
      if (!req.query.id || req.query.id === "") {
        res.status(404).json(new ApiResult("ERROR", null, [{
          code: 'CONTAINER-001',
          message: 'Input Id empty',
          detail: 'Ensure that the input Id is not empty',
          help: 'https://example.com/help/error/CONTAINER-001'
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
          help: 'https://example.com/help/error/CONTAINER-001'
        }]));
        return;
      }
  
      const updatedContainer = req.body;
  
      if (!updatedContainer) {
        res.status(400).json(new ApiResult("ERROR", null, [{
          code: 'CONTAINER-001',
          message: 'Missing or invalid request body',
          detail: 'Ensure that the request body is not empty and is a valid container object',
          help: 'https://example.com/help/error/CONTAINER-001'
        }]));
        return;
      }
  
      const success = containerService.putContainer(id, updatedContainer);
  
      if (success) {
        res.status(200).json(new ApiResult("OK", null, null));
      } else {
        res.status(404).json(new ApiResult("ERROR", null, [{
          code: 'CONTAINER-001',
          message: 'Incorrect Id, this id does not exist',
          detail: 'Ensure that the Id included in the request is correct',
          help: 'https://example.com/help/error/CONTAINER-001'
        }]));
      }
    } catch (ex) {
      res.status(500).json(new ApiResult("ERROR", null, [{
        code: 'CONTAINER-001',
        message: 'Internal server error',
        detail: 'Server has an internal error with the request',
        help: 'https://example.com/help/error/CONTAINER-001'
      }]));
    }
  }

  function DELETE(req, res, next) {
    try {
      if (!req.query.id || req.query.id === "") {
        res.status(404).json(new ApiResult("ERROR", null, [{
          code: 'CONTAINER-001',
          message: 'Input Id empty',
          detail: 'Ensure that the input Id is not empty',
          help: 'https://example.com/help/error/CONTAINER-001'
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
          help: 'https://example.com/help/error/CONTAINER-001'
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
          help: 'https://example.com/help/error/CONTAINER-001'
        }]));
      }
    } catch (ex) {
      res.status(500).json(new ApiResult("ERROR", null, [{
        code: 'CONTAINER-001',
        message: 'Internal server error',
        detail: 'Server has an internal error with the request',
        help: 'https://example.com/help/error/CONTAINER-001'
      }]));
    }
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
