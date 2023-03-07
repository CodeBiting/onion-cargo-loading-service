const logger = require("../../api/logger");

module.exports = function (clientService) {

  let operations = {
    GET,
    POST,
    PUT,
    DELETE,
  };

  function GET(req, res, next) {
    //logger.info(`About to update client id: ${req.query.id}`)
    try {
      if (req.query.id === undefined) {
        let clients = clientService.getClients();
        res.status(200).json(new ApiResult("OK", clients, null));
      } else if (req.query.id === "") {
        res.status(404).json(new ApiResult("ERROR", null, [{
          code: 'CLIENT-001',
          message: 'Id vacia',
          detail: 'Ensure that the input Id is not empty',
          help: 'https://example.com/help/error/CLIENT-001'
        }]));
      } else {
        let client = clientService.getClient(req.query.id);
        if (client === undefined) {
          res.status(404).json(new ApiResult("ERROR", null, [{
            code: 'CLIENT-001',
            message: 'Id incorrecta, esta ID no existe',
            detail: 'Asegúrese de que la identificación incluida en la solicitud sea correcta',
            help: 'https://example.com/help/error/CLIENT-001'
          }]));
        } else {
          res.status(200).json(new ApiResult("OK", client, null));
        }
      }
    } catch (ex) {
      res.status(500).json(new ApiResult("ERROR", null, [{
        code: 'CLIENT-001',
        message: 'Internal server error',
        detail: 'Server has an internal error with the request',
        help: 'https://example.com/help/error/CLIENT-001'
      }]));
    }
  }

  function POST(req, res, next) {
    try {
      let newClient = req.body;
      let clientCreated = clientService.postClient(newClient);
      console.log(clientCreated);
      res.status(201).json(new ApiResult("OK", clientCreated, null));
    } catch (ex) {

      if (ex.code === 'CLIENT-001') {
        res.status(400).json(new ApiResult("ERROR", null, [{
          code: 'CLIENT-001',
          message: 'Solicitud invalida',
          detail: 'Asegurate de que no este vavio i sea valido',
          help: 'https://example.com/help/error/CLIENT-001'
        }]));
      } else if (ex.code === 'CLIENT-002') {
          res.status(404).json(new ApiResult("ERROR", null, [{
          code: 'CLIENT-002',
          message: 'Cliente no encontrado',
          detail: 'Asegúrese de que el ID de entrada no esté vacío',
          help: 'https://example.com/help/error/CLIENT-002'
        }]));
      } else {
        res.status(500).json(new ApiResult("ERROR", null, [{
        code:'CLIENT-003',
        message:'Error del servidor interno', 
        detail: 'El servidor tiene un error interno con la solicitud.', 
        help:'https://example.com/help/error/CLIENT-003'}]));
      }
    }
  }

  // function POST(req, res, next) {
  //   logger.info(`Creating a client: ${JSON.stringify(req.body)}`);
  //   let result = 0;
  //   let message = '';
  //   try {
  //     result = clientService.postclient(req.body.id);
  //     message = (result === 0 ? 'Client created successfully' : 'Error creating client');
  //   } catch (ex) {
  //     result = 9;
  //     message = ex.message;
  //   }
  //   switch (result) {
  //     case 0:
  //       res.status(201).json({ message });
  //       break;

  //     case 1:
  //       res.status(400).json({ message: 'Introduce un numero' });
  //       break;

  //     case 2:
  //       res.status(404).json({ message: 'Cliente no encontrado' });
  //       break;

  //     default:
  //       res.status(500).json({ message: 'Error interno del servidor' });
  //       break;
  //   }
  // }

  function PUT(req, res, next) {
    try {
      if (!req.query.id || req.query.id === "") {
        res.status(400).json({
          message: 'Error en los parámetros proporcionados',
          errors: [{
            code: 'CLIENTE-001',
            message: 'Falta introducir numero',
            detail: 'Asegúrese de que el ID de entrada no esté vacío',
            help: 'https://example.com/help/error/CLIENTE-001'
          }]
        });
        return;
      }

      const id = Number(req.query.id);

      if (isNaN(id) || id <= 0) {
        res.status(400).json({
          message: 'Error en los parámetros proporcionados',
          errors: [{
            code: 'CLIENTE-002',
            message: 'La id tiene que ser un número positivo',
            detail: 'Asegúrese de que el ID de entrada sea un número positivo',
            help: 'https://example.com/help/error/CLIENTE-002'
          }]
        });
        return;
      }

      const result = clientService.putClient(id, clientData);

      if (result === 0) {
        res.status(200).json({ message: 'Cliente actualizado con éxito' });
      } else if (result === 1) {
        res.status(400).json({
          message: 'Error en los parámetros proporcionados',
          errors: [{
            code: 'CLIENTE-004',
            message: 'Incorrect request body parameters',
            detail: 'Ensure that the request body parameters are correct',
            help: 'https://example.com/help/error/CLIENTE-004'
          }]
        });
      } else if (result === 2) {
        res.status(404).json({
          message: 'Error en los parámetros proporcionados',
          errors: [{
            code: 'CLIENTE-005',
            message: 'Cliente no encontrado',
            detail: 'Asegúrese de que la identificación del cliente incluida en la solicitud sea correcta',
            help: 'https://example.com/help/error/CLIENTE-005'
          }]
        });
      } else {
        res.status(500).json({
          message: 'Error interno del servidor',
          errors: [{
            code: 'CLIENTE-006',
            message: 'Internal server error',
            detail: 'Server has an internal error with the request',
            help: 'https://example.com/help/error/CLIENTE-006'
          }]
        });
      }
    } catch (ex) {
      res.status(500).json({
        message: 'Error interno del servidor',
        errors: [{
          code: 'CLIENTE-007',
          message: 'Internal server error',
          detail: 'Server has an internal error with the request',
          help: 'https://example.com/help/error/CLIENTE-007'
        }]
      });
    }
  }

  function DELETE(req, res, next) {
    try {
      if (!req.query.id || req.query.id === "") {
        res.status(400).json(new ApiResult("ERROR", null, [{
          code: 'CLIENT-001',
          message: 'Falta la id del cliente',
          detail: 'Asegúrese de proporcionar la id del cliente en la solicitud',
          help: 'https://ejemplo.com/ayuda/error/CLIENT-001'
        }]));

        return;
      }

      const id = req.query.id;
      const success = clientService.deleteClient(id, req.body);

      if (success === 0) {
        res.status(200).json(new ApiResult("OK", null, null));

      } else if (success === 1) {
        res.status(400).json(new ApiResult("ERROR", null, [{
          code: 'CLIENT-002',
          message: 'Error en los parámetros proporcionados',
          detail: 'Asegúrese de proporcionar parámetros válidos en la solicitud',
          help: 'https://ejemplo.com/ayuda/error/CLIENT-002'
        }]));

      } else if (success === 2) {
        res.status(400).json(new ApiResult("ERROR", null, [{
          code: 'CLIENT-003',
          message: 'La id debe ser un número positivo',
          detail: 'Asegúrese de proporcionar una id válida en la solicitud',
          help: 'https://ejemplo.com/ayuda/error/CLIENT-003'
        }]));

      } else if (success === 3) {
        res.status(404).json(new ApiResult("ERROR", null, [{
          code: 'CLIENT-004',
          message: 'Cliente no encontrado',
          detail: 'Asegúrese de proporcionar una id de cliente válida en la solicitud',
          help: 'https://ejemplo.com/ayuda/error/CLIENT-004'
        }]));

      }
    } catch (ex) {
      res.status(500).json(new ApiResult("ERROR", null, [{
        code: 'CLIENT-005',
        message: 'Error interno del servidor',
        detail: 'El servidor ha encontrado un error interno al procesar la solicitud',
        help: 'https://ejemplo.com/ayuda/error/CLIENT-005'
      }]));
    }
  }

  GET.apiDoc = {
    summary: "Recuperar cliente.",
    operationId: "getClient",
    responses: {
      200: {
        description: "Lista de clientes.",
        schema: {
          type: "array",
          items: {
            $ref: "#/definitions/Client",
          },
        },
      },
      404: {
        description: "client not found",
      },
      400: {
        description: "client bad request",
      },
      500: {
        description: "client internal error"
      },
    },
  };

  POST.apiDoc = {
    summary: "Crear cliente.",
    operationId: "createClient",
    consumes: ["application/json"],
    parameters: [
      {
        in: "body",
        name: "client",
        schema: {
          $ref: "#/definitions/Client",
        },
      },
    ],
    responses: {
      201: {
        description: "Creado",
      },
      404: {
        description: "client not found",
      },
      400: {
        description: "client bad request",
      },
      500: {
        description: "client internal error"
      },
    },
  };

  PUT.apiDoc = {
    summary: "Actualizar cliente.",
    operationId: "updateClient",
    parameters: [
      {
        in: "query",
        name: "id",
        required: true,
        type: "integer",
      },
      {
        in: "body",
        name: "client",
        schema: {
          $ref: "#/definitions/Client",
        },
      },
    ],
    responses: {
      200: {
        description: "Actualizacion correcta",
      },
      404: {
        description: "client not found",
      },
      400: {
        description: "client bad request",
      },
      500: {
        description: "client internal error"
      },
    },
  };

  DELETE.apiDoc = {
    summary: "Borrar cliente.",
    operationId: "deleteClient",
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
        description: "Borrado",
      },
      404: {
        description: "client not found",
      },
      400: {
        description: "client bad request",
      },
      500: {
        description: "client internal error"
      },
    },
  };

  return operations;
}