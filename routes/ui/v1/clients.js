var express = require('express');
//const { pagination } = require('../../../api/requestQuery');
var router = express.Router();
const clientService = require(`../../../api/v1/clientService`);
const reqQuery = require(`../../../api/requestQuery`);

const ints = 100;
const dates=250;
const strings=200;

const POST = 1
const PUT = 2
const DELETE = 3


let query=null;
//const prova = clientService.getClients()
router.get('/',async function(req, res, next){
    let pag=reqQuery.pagination();
    query = await clientService.getClientsConainersRegisters(pag);
    res.render('clients', {title: 'Cargo Loading: Clients', gridColumns:JSON.stringify([{field:"id",initialWidth:ints},{field:"code",initialWidth:strings},{field:"dateStart",initialWidth:dates},{field:"dateFinal",initialWidth:dates},{field:"active",initialWidth:ints},{field:"token",initialWidth:strings},{field:"notes",initialWidth:strings},{field:"containers",initialWidth:ints},{field:"registers",initialWidth:ints},]),rowData:JSON.stringify(query), skip:pag.skip, limit:pag.limit, action: 'null'});
});

router.post('/',async function(req,res,next){
    let result = {
        message: ``,
        level: 'INFO'
    }

    try {
      if(req.body.method){
        let clientDone;
        if(req.body.method == POST){
            clientDone = await clientService.postClient(req.body);
            if(clientDone !== undefined){
                result.message = `Client ${clientDone.id} added.`;
            }
        } 
        else if(req.body.method == PUT){
            clientDone = await clientService.putClient(req.body.id,req.body);
            if(clientDone !== undefined){
                result.message = `Client ${clientDone.id} modified.`;
            }
        }
        else {
            clientDone = await clientService.deleteClient(req.body.id);
            result.message = `Client ${clientDone.id} deleted.`;
        }
      }
    } catch (ex) {
        result.message =  `${ex.message}`;
        result.level = 'ERROR';
    }

    let pag=reqQuery.pagination({skip: req.body.skip, limit: req.body.limit-req.body.skip});
    query = await clientService.getClientsConainersRegisters(pag);
    res.render('clients', 
      {
        title: 'Cargo Loading: Clients', 
        gridColumns:JSON.stringify([
          {field:"id",initialWidth:ints},
          {field:"code",initialWidth:strings},
          {field:"dateStart",initialWidth:dates},
          {field:"dateFinal",initialWidth:dates},
          {field:"active",initialWidth:ints},
          {field:"token",initialWidth:strings},
          {field:"notes",initialWidth:strings},
          {field:"containers",initialWidth:ints},
          {field:"registers",initialWidth:ints},
        ]),
      rowData:JSON.stringify(query), 
      skip:pag.skip, 
      limit:pag.limit, 
      result: result});
});

module.exports = router;