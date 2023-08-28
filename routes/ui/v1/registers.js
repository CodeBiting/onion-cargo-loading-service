const express = require('express');
// const { pagination } = require('../../../api/requestQuery');
const router = express.Router();
const registerService = require('../../../api/v1/registerService');
const reqQuery = require('../../../api/requestQuery');

const ints = 100;
const bigInts = 150;
const dates = 205;
const strings = 200; 

let query = null;
router.get('/', async function (req, res, next) {
  const pag = reqQuery.pagination();
  query = await registerService.getRegisters(pag, null, null);
  res.render('registers',
    {
      title: 'Cargo Loading: Registers',
      gridColumns: JSON.stringify([
        { field: 'id', initialWidth: ints },
        { field: 'clientId', initialWidth: ints },
        { field: 'date', initialWidth: dates },
        { field: 'origin', initialWidth: strings },
        { field: 'destiny', initialWidth: strings },
        { field: 'method', initialWidth: ints },
        { field: 'requestId', initialWidth: bigInts },
        { field: 'status', initialWidth: ints },
        { field: 'requestBody', resizable: true},
        { field: 'responseData', resizable: true}
      ]),
      rowData: JSON.stringify(query),
      skip: pag.skip,
      limit: pag.limit
    });
});

router.post('/', async function (req, res, next) {
  const result = {
    message: '',
    level: 'INFO'
  };
  const pag = reqQuery.pagination({ skip: req.body.skip, limit: req.body.limit - req.body.skip });
  query = await registerService.getRegisters(pag, null, null);
  res.render('registers',
    {
      title: 'Cargo Loading: Registers',
      gridColumns: JSON.stringify([
        { field: 'id', initialWidth: ints },
        { field: 'clientId', initialWidth: ints },
        { field: 'date', initialWidth: dates },
        { field: 'origin', initialWidth: strings },
        { field: 'destiny', initialWidth: strings },
        { field: 'method', initialWidth: ints },
        { field: 'requestId', initialWidth: bigInts },
        { field: 'status', initialWidth: ints },
        { field: 'requestBody', resizable: true },
        { field: 'responseData', resizable: true }
      ]),
      rowData: JSON.stringify(query),
      skip: pag.skip,
      limit: pag.limit,
      result
    });
});

module.exports = router;
