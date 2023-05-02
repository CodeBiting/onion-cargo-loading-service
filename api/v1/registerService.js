const mysql = require('mysql2');
const { log } = require('winston');

const database = require(`${__base}api/database`);
  
  const registerService = {

    async getRegister(id) {

      let sql = `SELECT * FROM register WHERE id = ${id}`;

      let [rows, fields] = await database.getPromise().query(sql, []);
      return rows;
      // if(id == ""){
      //   return undefined;
      // }else{
      //   return registers.find(o => o.id == id);
      // }
    },

    async getRegisters() {

      let sql = `SELECT * FROM register`;

      let [rows, fields] = await database.getPromise().query(sql, []);
      return rows;
      //return registers;
    },
    
    async postRegister(register){

      let sql = `INSERT INTO register (date, origin, destiny, method, status, requestBody, responseData)
                VALUES('${register.date}', '${register.origin}', '${register.destiny}', '${ register.method}',
                '${register.status}', '${register.requestBody}', '${register.responseData}')`;

      let [rows, fields] = await database.getPromise().query(sql, []);
      return rows;
      // const nextId = registers.reduce((maxId, register) => Math.max(maxId, register.id), 0) + 1;
      // registers.push({ ...register, id: nextId });
      // return registers[registers.length-1];
  
    },
  
    async putRegister(id, newRegisterData) {

      let sql = `UPDATE register SET
      date = '${newRegisterData.date}',
      origin = '${newRegisterData.origin}',
      destiny = '${newRegisterData.destiny}',
      method = '${ newRegisterData.method }',
      status = '${newRegisterData.status}',
      requestBody = '${newRegisterData.requestBody}',
      responseData = '${newRegisterData.responseData}'
      WHERE id = ${ id }`;

      let [rows, fields] = await database.getPromise().query(sql, []);
      return rows;
      // const registerToUpdate = registers.find(register => register.id == id);
      // if (registerToUpdate) {
      //   registerToUpdate.date = newRegisterData.date || registerToUpdate.date;
      //   registerToUpdate.origin = newRegisterData.origin || registerToUpdate.origin;
      //   registerToUpdate.destiny = newRegisterData.destiny || registerToUpdate.destiny;
      //   registerToUpdate.method = newRegisterData.method || registerToUpdate.method;
      //   registerToUpdate.status = newRegisterData.status || registerToUpdate.status;
      //   registerToUpdate.requestBody = newRegisterData.requestBody || registerToUpdate.requestBody; 
      //   registerToUpdate.responseData = newRegisterData.responseData || registerToUpdate.responseData;
      // }
      // return registerToUpdate;
    },
  
    async deleteRegister(id) {

      let sql = `DELETE FROM register WHERE id = ${ id }`;

      let [rows, fields] = await database.getPromise().query(sql, []);
      return rows;
      // const index = registers.findIndex(o => o.id == id); 
      // if (index >= 0) {
      //   let registerDeleted = registers.splice(index, 1); 
      //   return registerDeleted[0];
      // } else {
      //   return undefined; 
      // }
    }
  
  };
  
  module.exports = registerService;