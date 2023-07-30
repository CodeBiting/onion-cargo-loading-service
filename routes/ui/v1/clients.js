var express = require('express');
//const { pagination } = require('../../../api/requestQuery');
var router = express.Router();
const clientService = require(`${__base}api/v1/clientService`);
const reqQuery = require(`${__base}api/requestQuery`);

const ints = 100;
const dates=250;
const strings=200;

let query=null;
//const prova = clientService.getClients()
router.get('/',async function(req, res, next){
    let pag=reqQuery.pagination();
    query = await clientService.getClientsConainersRegisters(pag);
    res.render('clients', {title: 'Cargo Loading: Clients', gridColumns:JSON.stringify([{field:"id",initialWidth:ints},{field:"code",initialWidth:strings},{field:"dateStart",initialWidth:dates},{field:"dateFinal",initialWidth:dates},{field:"active",initialWidth:ints},{field:"token",initialWidth:strings},{field:"notes",initialWidth:strings},{field:"containers",initialWidth:ints},{field:"registers",initialWidth:ints},]),rowData:JSON.stringify(query), skip:pag.skip, limit:pag.limit, action: 'null'});
});

router.post('/',async function(req,res,next){
    let actions=`Error: We couldn't perform the actions.`;
    if(req.body.method){
        let clientDone;
        if(req.body.method==1){
            clientDone=await clientService.postClient(req.body);
            if(clientDone !== undefined){
                actions = `Client ${clientDone.id} added.`;
            }
        } 
        else if(req.body.method==2){
            clientDone=clientService.putClient(req.body.id,req.body);
            if(clientDone !== undefined){
                actions = `Client ${clientDone.id} modified.`;
            }
        }
        else {
            clientDone=clientService.deleteClient(req.body.id);
            actions = `Client ${clientDone.id} deleted.`;
        }
    }
    let pag=reqQuery.pagination({skip: req.body.skip, limit: req.body.limit-req.body.skip});
    query = await clientService.getClientsConainersRegisters(pag);
    res.render('clients', {title: 'Cargo Loading: Clients', gridColumns:JSON.stringify([{field:"id",initialWidth:ints},{field:"code",initialWidth:strings},{field:"dateStart",initialWidth:dates},{field:"dateFinal",initialWidth:dates},{field:"active",initialWidth:ints},{field:"token",initialWidth:strings},{field:"notes",initialWidth:strings},{field:"containers",initialWidth:ints},{field:"registers",initialWidth:ints},]),rowData:JSON.stringify(query), skip:pag.skip, limit:pag.limit, action: actions});
});

module.exports = router;