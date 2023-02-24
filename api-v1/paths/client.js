const logger = require("../../api/logger");

module.exports = function (clientService) {
  
  let operations = {
    GET,
    POST,
    PUT,
    DELETE,
  };

  function GET(req, res, next) {
    if (req.query.id) {
      // Retornem un client concret
      let client = clientService.getClient(req.query.id);
      let result = 0;
      let message = '';
      try {
        result = clientService.getClient(req.query.id);
        message = (result > 0 ? 'client not found' : '');
      } catch(ex) {
        result = 9;
        message = ex.message;
      }
      switch (result) {
        case 0:
          res.status(200).json({message});
          break;
      
        case 1:
          res.status(400).json({message});
          break;
        
        case 2:
          res.status(404).json({message});
          break;
      
        default:
          res.status(500).json({message});
          break;
      }
      if (client > 50) {
        let message = 'client Not found';
        res.status(404).json(message);
      } else {
        res.status(200).json(client);
      }
    } else {
      // Retornem tots els clients
      let clients = clientService.getClients();
      res.status(200).json(clients);
      
      if (clients > 50) {
        res.status(404).json(message);
      } else if (clients === 0){
        res.status(400).json(message);
      } else {
        res.status(500).json(message);
      }
    }
  }

  function POST(req, res, next) {
    logger.info(`Sobre crear un cliente: ${JSON.stringify(req.body)}`);
    let result = 0;
    let message = '';
    try {
      result = clientService.putclient(req.query.id);
      message = (result > 0 ? 'client not found' : '');
    } catch(ex) {
      result = 9;
      message = ex.message;
    }
    switch (result) {
      case 0:
        res.status(201).json({message});
        break;

      case 1:
        res.status(400).json({message});
        break;
      
      case 2:
        res.status(404).json({message});
        break;

      default:
        res.status(500).json({message});
        break;
    }
  }

  function PUT(req, res, next) {
    logger.info(`Sobre actualizar un id cliente: ${req.query.id}`);
    let result = clientService.putClient(req.query.id, req.body);
    switch (result) {
      case 0:
        res.status(200).json({ message: 'Cliente actualizado con éxito' });
        break;
  
      case 1:
        res.status(400).json({ message: 'Error en los parámetros proporcionados' });
        break;
      
      case 2:
        res.status(400).json({ message: 'La id tiene que ser un número positivo' });
        break;
  
      case 3:
        res.status(404).json({ message: 'Cliente no encontrado' });
        break;
  
      default:
        res.status(500).json({ message: 'Error interno del servidor' });
        break;
    }
  }

  function DELETE(req, res, next) {
    logger.info(`Sobre eliminar un id cliente: ${req.query.id}`);
    let result = clientService.deleteClient(req.query.id, req.body);
    switch (result) {
      case 0:
        res.status(200).json({ message: 'Cliente borrado con éxito' });
        break;
  
      case 1:
        res.status(400).json({ message: 'Error en los parámetros proporcionados' });
        break;
      
      case 2:
        res.status(400).json({ message: 'La id tiene que ser un número positivo' });
        break;
  
      case 3:
        res.status(404).json({ message: 'Cliente no encontrado' });
        break;
  
      default:
        res.status(500).json({ message: 'Error interno del servidor' });
        break;
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