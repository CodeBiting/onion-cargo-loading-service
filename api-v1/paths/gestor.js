const logger = require("../../api/logger");

module.exports = function (gestorService) {
  let operations = {
    GET,
    POST,
    PUT,
    DELETE,
  };

  function GET(req, res, next) {
    if (req.query.id) {
      // Retornem un gestor concret
      let gestor = gestorService.getGestor(req.query.id);
      let result = 0;
      let message = '';
      try {
        result = gestorService.getGestor(req.query.id);
        message = (result > 0 ? 'gestor not found' : '');
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
      if (gestor > 50) {
        let message = 'Gestor Not found';
        res.status(404).json(message);
      } else {
        res.status(200).json(gestor);
      }
    } else {
      // Retornem tots els gestors
      let gestors = gestorService.getGestors();
      res.status(200).json(gestors);
      
      if (gestors > 50) {
        res.status(404).json(message);
      } else if (gestors === 0){
        res.status(400).json(message);
      } else {
        res.status(500).json(message);
      }
    }
  }

  function POST(req, res, next) {
    logger.info(`Sobre crear un gestor de cliente: ${JSON.stringify(req.body)}`);
    let result = 0;
    let message = '';
    try {
      result = gestorService.putGestor(req.query.id);
      message = (result > 0 ? 'gestor not found' : '');
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
    logger.info(`Sobre actualizar un gestor de cliente id: ${req.query.id}`);
    let result = gestorService.putGestor(req.query.id, req.body);
    switch (result) {
      case 0:
        res.status(200).json({ message: 'Gestor actualizado con éxito' });
        break;
  
      case 1:
        res.status(400).json({ message: 'Error en los parámetros proporcionados' });
        break;
      
      case 2:
        res.status(400).json({ message: 'La id tiene que ser un número positivo' });
        break;
  
      case 3:
        res.status(404).json({ message: 'Gestor no encontrado' });
        break;
  
      default:
        res.status(500).json({ message: 'Error interno del servidor' });
        break;
    }
  }

  function DELETE(req, res, next) {
    logger.info(`Sobre eliminar un gestor de cliente id: ${req.query.id}`);
    let result = gestorService.putGestor(req.query.id, req.body);
    switch (result) {
      case 0:
        res.status(200).json({ message: 'Gestor borrado con éxito' });
        break;
  
      case 1:
        res.status(400).json({ message: 'Error en los parámetros proporcionados' });
        break;
      
      case 2:
        res.status(400).json({ message: 'La id tiene que ser un número positivo' });
        break;
  
      case 3:
        res.status(404).json({ message: 'Gestor no encontrado' });
        break;
  
      default:
        res.status(500).json({ message: 'Error interno del servidor' });
        break;
    }
  }

  GET.apiDoc = {
    summary: "Recuperar gestor cliente.",
    operationId: "getGestor",
    responses: {
      200: {
        description: "Lista de gestores cliente.",
        schema: {
          type: "array",
          items: {
            $ref: "#/definitions/Gestor",
          },
        },
      },
      404: {
        description: "gestor not found",
      },
      400: {
        description: "gestor bad request",
      },
      500: {
        description: "gestor internal error"
      },
    },
  };

  POST.apiDoc = {
    summary: "Crear gestor cliente.",
    operationId: "createGestor",
    consumes: ["application/json"],
    parameters: [
      {
        in: "body",
        name: "gestor",
        schema: {
          $ref: "#/definitions/Gestor",
        },
      },
    ],
    responses: {
      201: {
        description: "Creado",
      },
      404: {
        description: "gestor not found",
      },
      400: {
        description: "gestor bad request",
      },
      500: {
        description: "gestor internal error"
      },
    },
  };

  PUT.apiDoc = {
    summary: "Actualizar gestor cliente.",
    operationId: "updateGestor",
    parameters: [
      {
        in: "query",
        name: "id",
        required: true,
        type: "integer",
      },
      {
        in: "body",
        name: "gestor",
        schema: {
          $ref: "#/definitions/Gestor",
        },
      },
    ],
    responses: {
      200: {
        description: "Actualizacion correcta",
      },
      404: {
        description: "gestor not found",
      },
      400: {
        description: "gestor bad request",
      },
      500: {
        description: "gestor internal error"
      },
    },
  };
  
  DELETE.apiDoc = {
    summary: "Borrar gestor cliente.",
    operationId: "deleteGestor",
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
        description: "gestor not found",
      },
      400: {
        description: "gestor bad request",
      },
      500: {
        description: "gestor internal error"
      },
    },
  };

  return operations;
};