const express = require('express');
// const { pagination } = require('../../../api/requestQuery');
const router = express.Router();
const clientService = require('../../../api/v1/clientService');
const reqQuery = require('../../../api/requestQuery');
const containerService = require('../../../api/v1/containerService');
const registerService = require('../../../api/v1/registerService');

let query = null;

const ints = 100;
const dates = 250;
const strings = 200;

let desactivated;
router.get('/', async function (req, res, next) {
  const pag = reqQuery.pagination();
  query = await clientService.getClientsConainersRegisters(pag);
  desactivated = false;
  res.render('clients',
    {
      title: 'Cargo Loading: Clients',
      gridColumns: JSON.stringify([
        { field: 'id', initialWidth: ints },
        { field: 'code', initialWidth: strings },
        { field: 'dateStart', initialWidth: dates },
        { field: 'dateFinal', initialWidth: dates },
        { field: 'active', initialWidth: ints },
        { field: 'token', initialWidth: strings },
        { field: 'notes', initialWidth: strings },
        { field: 'containers', initialWidth: ints },
        { field: 'registers', initialWidth: ints }
      ]),
      rowData: JSON.stringify(query),
      skip: pag.skip,
      limit: pag.limit,
      action: 'null',
      desactivated
    });
});

router.post('/', async function (req, res, next) {
  let query = null;
  let idToActive;
  desactivated = false;
  const result = {
    message: '',
    level: 'INFO'
  };

  const POST = 1;
  const PUT = 2;
  const DELETE = 3;
  const DESACTIVATE = 4;

  try {
    if (req.body.method) {
      let clientDone;
      if (req.body.method === POST || req.body.method === `${POST}`) {
        const repeatCode = await clientService.getClients({ skip: 0, limit: 1 }, [{ property: 'code', rule: 'eq', value: `'${req.body.code}'` }], null);
        // if there is one client with the same code as the submited and has a date in the delete_at cell (desactivated)
        if (repeatCode.length === 1 && repeatCode[0].deleted_at) {
          desactivated = true;
          idToActive = repeatCode[0].id;
        } else {
          clientDone = await clientService.postClient(req.body);
          if (clientDone !== undefined) {
            result.message = `Client ${clientDone.id} added.`;
          }
        }
      } else if (req.body.method === PUT || req.body.method === `${PUT}`) {
        clientDone = await clientService.getClients({ skip: 0, limit: 1 }, [{ property: 'id', rule: 'eq', value: `'${req.body.id}'` }, { property: 'deleted_at', rule: 'isnull' }], null);
        // if the client is desactivated error
        if (!clientDone.length) {
          result.level = 'ERROR';
          result.message = `Client ${req.body.id} is desactivated you can't modify it`;
        } else {
          clientDone = await clientService.putClient(req.body.id, req.body);
          if (clientDone !== undefined) {
            result.message = `Client ${clientDone.id} modified.`;
          }
        }
      } else if (req.body.method === DELETE || req.body.method === `${DELETE}`) {
        clientDone = await clientService.getClients({ skip: 0, limit: 1 }, [{ property: 'id', rule: 'eq', value: `'${req.body.id}'` }, { property: 'deleted_at', rule: 'isnull' }], null);
        // if the client is desactivated error
        if (!clientDone.length) {
          result.level = 'ERROR';
          result.message = `Client ${req.body.id} is desactivated you can't delete it`;
        } else {
          clientDone = await clientService.deleteClient(req.body.id);
          if (clientDone !== undefined) {
            result.message = `Client ${clientDone.id} deleted.`;
          }
        }
      } else if (req.body.method === DESACTIVATE || req.body.method === `${DESACTIVATE}`) {
        // OPTIMITZAR
        let hasContainers = false;
        let hasRegisters = false;
        let rows = await containerService.getClientContainers(req.body.id, 0, 1);
        // if the client has containers
        if (rows.length > 0) hasContainers = true;
        rows = await registerService.getRegisters({ skip: 0, limit: 1 }, [{ property: 'client_id', rule: 'eq', value: `'${req.body.id}'` }], null);
        // if the client has registers
        if (rows.length > 0) hasRegisters = true;
        clientDone = await clientService.desactivateClient(req.body.id, hasContainers, hasRegisters);
        if (clientDone !== undefined) {
          result.message = `Client ${clientDone.id} and his containers/registers desactivated.`;
        }
      } else {
        // OPTIMITZAR
        let hasContainers = false;
        let hasRegisters = false;
        let rows = await containerService.getClientContainers(req.body.id, 0, 1);
        // if the client has containers
        if (rows.length > 0) hasContainers = true;
        rows = await registerService.getRegisters({ skip: 0, limit: 1 }, [{ property: 'client_id', rule: 'eq', value: `'${req.body.id}'` }], null);
        // if the client has registers
        if (rows.length > 0) hasRegisters = true;
        clientDone = await clientService.activateClient(req.body.id, hasContainers, hasRegisters);
        if (clientDone !== undefined) {
          result.message = `Client ${clientDone.id} and his containers/registers activated.`;
        }
      }
    }
  } catch (ex) {
    result.message = `${ex.message}`;
    result.level = 'ERROR';
  }

  const pag = reqQuery.pagination({ skip: req.body.skip, limit: req.body.limit - req.body.skip });
  query = await clientService.getClientsConainersRegisters(pag);

  res.render('clients',
    {
      title: 'Cargo Loading: Clients',
      gridColumns: JSON.stringify([
        { field: 'id', initialWidth: ints },
        { field: 'code', initialWidth: strings },
        { field: 'dateStart', initialWidth: dates },
        { field: 'dateFinal', initialWidth: dates },
        { field: 'active', initialWidth: ints },
        { field: 'token', initialWidth: strings },
        { field: 'notes', initialWidth: strings },
        { field: 'containers', initialWidth: ints },
        { field: 'registers', initialWidth: ints }
      ]),
      rowData: JSON.stringify(query),
      skip: pag.skip,
      limit: pag.limit,
      result,
      desactivated,
      idToActive
    });
});

module.exports = router;
