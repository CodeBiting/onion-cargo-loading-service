var express = require('express');
var router = express.Router();
const logger = require("../../api/logger");

/**
 * [GET] /container: retorna tots els contenidors del client
 */
router.get('/', function(req, res, next) {
  let containers = [
    {
      id: 1,
      code: 'C1',
      description: 'Container 1',
      x: 1,
      y: 1,
      z: 1,
      maxWeight: 1,
    }
  ];
  // TODO

  res.status(200).json({
    result: 0,
    message: null,
    data: containers,
  });
});

// [GET] /container/<container_id>: retorna un contenidor
router.get('/:containerId', function(req, res, next) {
  // TODO
  res.status(200).json({
    result: 0,
    message: null,
    data: null,
  });
});

// API per fer peticions del millor contenidor:
// TODO: [POST] /container/smallest: es passa els elements que es volen ficar al contenidor (mides i pes) i es retorna el contenidor més petit que hi càpiguen i l’ordre i disposició amb què s’hi han de posar
router.get('/smallest', function(req, res, next) {
  // TODO
  res.status(200).json({
    result: 0,
    message: null,
    data: null,
  });
});

// TODO: [POST] /container: crea un nou contenidor
router.post('/', function(req, res, next) {
  // TODO
  res.status(200).json({
    result: 0,
    message: null,
    data: null,
  });
});

// TODO: [PUT] / container/<container_id> : modifica un contenidor
router.put('/:containerId', function(req, res, next) {
  // TODO
  res.status(200).json({
    result: 0,
    message: null,
    data: null,
  });
});

// TODO: [DELETE] /container/<container_id> elimina un contenidor
router.delete('/:containerId', function(req, res, next) {
  // TODO
  res.status(200).json({
    result: 0,
    message: null,
    data: null,
  });
});

module.exports = router;
