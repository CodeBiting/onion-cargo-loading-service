var express = require('express');
//const { pagination } = require('../../../api/requestQuery');
var router = express.Router();
const registerService = require(`${__base}api/v1/registerService`);
const reqQuery = require(`${__base}api/requestQuery`);

const ints = 100;
const bigInts = 150;
const dates=205;
const strings=200;

let query=null;
router.get('/',async function(req, res, next){
    let pag=reqQuery.pagination();
    query = await registerService.getRegisters(pag,null,null);
    res.render('registers', {title: 'Cargo Loading: Regiters', gridColumns:JSON.stringify([{field:"id", initialWidth:ints},{field:"clientId", initialWidth:bigInts},{field:"date", initialWidth:dates},{field:"origin", initialWidth:strings},{field:"destiny", initialWidth:strings},{field:"method", initialWidth:ints},{field:"requestId", initialWidth:bigInts},{field:"status", initialWidth:ints},{field:"requestBody", initialWidth:strings},{field:"responseData", initialWidth:strings},]),rowData:JSON.stringify(query), skip:pag.skip, limit:pag.limit});
});

router.post('/',async function(req,res,next){
    let actions=`Error: We couldn't perform the actions.`;
    let containerDone;
    containerDone=registerService.putRegister(req.body.id,req.body);
    if(containerDone !== undefined){
        actions = `Container ${containerDone.id} modified.`;
    }
    let pag=reqQuery.pagination({skip: req.body.skip, limit: req.body.limit-req.body.skip});
    query = await registerService.getRegisters(pag,null,null);
    res.render('registers', {title: 'Cargo Loading: Registers', gridColumns:JSON.stringify([{field:"id", initialWidth:ints},{field:"clientId", initialWidth:bigInts},{field:"date", initialWidth:dates},{field:"origin", initialWidth:strings},{field:"destiny", initialWidth:strings},{field:"method", initialWidth:ints},{field:"requestId", initialWidth:bigInts},{field:"status", initialWidth:ints},{field:"requestBody", initialWidth:strings},{field:"responseData", initialWidth:strings},]),rowData:JSON.stringify(query), skip:pag.skip, limit:pag.limit});
})

module.exports = router;