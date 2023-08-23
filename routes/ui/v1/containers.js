const express = require('express');
// const { pagination } = require('../../../api/requestQuery');
const router = express.Router();
const containerService = require('../../../api/v1/containerService');
const reqQuery = require('../../../api/requestQuery');

const ints = 100;
const bigInts = 150;
const strings = 250;

let desactivated;
let query = null;
router.get('/', async function (req, res, next) {
  desactivated = false;
  const pag = reqQuery.pagination();
  query = await containerService.getContainers(pag, [{ property: 'deleted_at', rule: 'isnull' }], null);
  res.render('containers',
    {
      title: 'Cargo Loading: Containers',
      gridColumns: JSON.stringify([
        { field: 'id', initialWidth: ints },
        { field: 'clientId', initialWidth: bigInts },
        { field: 'code', initialWidth: strings },
        { field: 'description', initialWidth: strings },
        { field: 'width', initialWidth: ints },
        { field: 'length', initialWidth: ints },
        { field: 'height', initialWidth: ints },
        { field: 'maxWeight', initialWidth: bigInts }
      ]),
      rowData: JSON.stringify(query),
      skip: pag.skip,
      limit: pag.limit,
      desactivated
    });
});

router.post('/', async function (req, res, next) {
  const result = {
    message: '',
    level: 'INFO'
  };
  let idToActive;
  const POST = 1;
  const PUT = 2;
  const DELETE = 3;
  const DESACTIVATE = 4;
  desactivated = false;

  try {
    if (req.body.method) {
      let containerDone;
      if (req.body.method === POST || req.body.method === `${POST}`) {
        const repeatCode = await containerService.getContainers({ skip: 0, limit: 1 }, [{ property: 'code', rule: 'eq', value: `'${req.body.code}'` }], null);
        // if there is one container with the same code as the submited and has a date in the delete_at cell (desactivated)
        if (repeatCode.length === 1 && repeatCode[0].deleted_at) {
          desactivated = true;
          idToActive = repeatCode[0].id;
        } else {
          containerDone = await containerService.postContainer(req.body);
          if (containerDone !== undefined) {
            result.message = `Container ${containerDone.id} added.`;
          }
        }
      } else if (req.body.method === PUT || req.body.method === `${PUT}`) {
        containerDone = await containerService.getContainers({ skip: 0, limit: 1 }, [{ property: 'deleted_at', rule: 'isnull' }], null);
        // if the container is desactivated error
        if (!containerDone.length) {
          result.level = 'ERROR';
          result.message = `Container ${req.body.id} is desactivated you can't delete it`;
        } else {
          containerDone = await containerService.putContainer(req.body.id, req.body);
          if (containerDone !== undefined) {
            result.message = `Container ${containerDone.id} modified.`;
          }
        }
      } else if (req.body.method === DELETE || req.body.method === `${DELETE}`) {
        containerDone = await containerService.getContainers({ skip: 0, limit: 1 }, [{ property: 'deleted_at', rule: 'isnull' }], null);
        // if the container is desactivated error
        if (!containerDone.length) {
          result.level = 'ERROR';
          result.message = `Container ${req.body.id} is desactivated you can't delete it`;
        } else {
          containerDone = await containerService.deleteContainer(req.body.id);
          if (containerDone !== undefined) {
            result.message = `Container ${containerDone.id} deleted.`;
          }
        }
      } else if (req.body.method === DESACTIVATE || req.body.method === `${DESACTIVATE}`) {
        containerDone = await containerService.desactivateContainer(req.body.id);
        if (containerDone !== undefined) {
          result.message = `Container ${containerDone.id} desactivated.`;
        }
      } else {
        containerDone = await containerService.activateContainer(req.body.id);
        if (containerDone !== undefined) {
          result.message = `Container ${containerDone.id} activated.`;
        }
      }
    }
  } catch (ex) {
    result.message = `${ex.message}`;
    result.level = 'ERROR';
  }

  const pag = reqQuery.pagination({ skip: req.body.skip, limit: req.body.limit - req.body.skip });
  query = await containerService.getContainers(pag, [{ property: 'deleted_at', rule: 'isnull' }], null);
  res.render('containers',
    {
      title: 'Cargo Loading: Containers',
      gridColumns: JSON.stringify([
        { field: 'id', initialWidth: ints },
        { field: 'clientId', initialWidth: ints },
        { field: 'code', initialWidth: strings },
        { field: 'description', initialWidth: strings },
        { field: 'width', initialWidth: ints },
        { field: 'length', initialWidth: ints },
        { field: 'height', initialWidth: ints },
        { field: 'maxWeight', initialWidth: bigInts }
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
