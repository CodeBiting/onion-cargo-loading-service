const logger = require("../../api/logger");

module.exports = function (userService) {

    let operations = {
      GET,
      POST,
      PUT,
      DELETE,
    };

    function GET(req, res, next) {
      let users = userService.getUsers();
      res.status(200).json(users);
    }

    function POST(req, res, next) {
      logger.info(`Crear usuari: ${JSON.stringify(req.body)}`);
      userService.postUser(req.body);
      res.status(201).json();
    }
  
    function PUT(req, res, next) {
      try {
        logger.info(`Actualitzar usuari: ${req.query.id}`);
        userService.putUser(req.query.id, req.body);
        res.status(200).json();
      } catch (err) {
        res.status(500).json(err);
      }
    }
  
    function DELETE(req, res, next) {
      logger.info(`Borrar usuari: ${req.query.id}`);
      let result = 0;
      let message = '';
      try {
        result = userService.deleteGestor(req.query.id);
        message = (result === 1 ? 'user not found' : '');
      } catch(ex) {
        result = 9;
        message = ex.message;
      }
      switch (result) {
        case 0:
          res.status(200).json({message});
          break;
        
        case 1:
          res.status(404).json({message});
          break;
  
        default:
          res.status(500).json({message});
          break;
      }
    }
  
    GET.apiDoc = {
      summary: "Fetch users.",
      operationId: "getUser",
      responses: {
        200: {
          description: "List of users.",
          schema: {
            type: "array",
            items: {
              $ref: "#/definitions/User",
            },
          },
        },
      },
    };

    POST.apiDoc = {
    summary: "Create users.",
    operationId: "createUser",
    consumes: ["application/json"],
    parameters: [
      {
        in: "body",
        name: "user",
        schema: {
          $ref: "#/definitions/User",
        },
      },
    ],
      responses: {
        201: {
          description: "crear",
        },
      },
    };

    PUT.apiDoc = {
      summary: "Update users.",
      operationId: "updateUser",
      parameters: [
        {
          in: "query",
          name: "id",
          required: true,
          type: "string",
        },
        {
          in: "body",
          name: "container",
          schema: {
            $ref: "#/definitions/User",
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
      summary: "Delete users.",
      operationId: "deleteUser",
      consumes: ["application/json"],
      parameters: [
        {
          in: "query",
          name: "id",
          required: true,
          type: "string",
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