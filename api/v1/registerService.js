const mysql = require('mysql2');
const { log } = require('winston');

const database = require(`${__base}api/database`);
  
  const registerService = {

    async getRegister(id) {

      let sql = `SELECT id, clientId, CONVERT_TZ(date, '+00:00', @@session.time_zone) AS date, origin, destiny, method, requestId, status, requestBody, responseData FROM register WHERE id = ?`;

      let [rows, fields] = await database.getPromise().query(sql, [id]);
      
      return rows[0];

    },

    async getRegisters() {

      let sql = `SELECT id, clientId, CONVERT_TZ(date, '+00:00', @@session.time_zone) AS date, origin, destiny, method, requestId, status, requestBody, responseData FROM register`;

      let [rows, fields] = await database.getPromise().query(sql, []);
      return rows;

    },
    
    async postRegister(register){

      let sql = `INSERT INTO register (clientId, date, origin, destiny, method, requestId, status, requestBody, responseData)
                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      let values = [
        register.clientId,
        register.date,
        register.origin,
        register.destiny,
        register.method,
        register.requestId,
        register.status,
        register.requestBody,
        register.responseData
      ];

      let [rows, fields] = await database.getPromise().query(sql, values);

      sql = `SELECT id, clientId, CONVERT_TZ(date, '+00:00', @@session.time_zone) AS date, origin, destiny, method, requestId, status, requestBody, responseData FROM register WHERE id = ?`;
      [rows, fields] = await database.getPromise().query(sql, [rows.insertId]);
    
      return rows[0];

    },
  
    async putRegister(id, newRegisterData) {

      sql = `UPDATE register SET
        date = CONVERT_TZ('${newRegisterData.date}', '+00:00', @@session.time_zone),
        origin = '${newRegisterData.origin}',
        destiny = '${newRegisterData.destiny}',
        method = '${ newRegisterData.method }',
        requestId = '${ newRegisterData.requestId }',
        status = '${newRegisterData.status}',
        requestBody = '${newRegisterData.requestBody}',
        responseData = '${newRegisterData.responseData}'
      WHERE id = ${ id }`;

      let [rows, fields] = await database.getPromise().query(sql, []);

      // return undefined if client not found
      if (rows.affectedRows === 0) {
        return undefined;
      }

      if (rows.affectedRows !== 1) {
        throw new Error(`Error updating client, affected rows = ${rows.affectedRows}`);
      }

      sql = `SELECT * FROM register WHERE id = ${id}`;
      [rows, fields] = await database.getPromise().query(sql, []);

      if (rows.length !== 1) {
        throw new Error(`Error retrieving updated client data`);
      }

      return rows[0];

    },
  
    async deleteRegister(id) {

      let sql = `SELECT id, clientId, CONVERT_TZ(date, '+00:00', @@session.time_zone) AS date, origin, destiny, method, requestId, status, requestBody, responseData FROM register WHERE id = ?`;
      let [rows, fields] = await database.getPromise().query(sql, [id]);

      if (rows.length !== 1) {

        return undefined;
      }

      let registerToDelete = rows[0];

      sql = `DELETE FROM register WHERE id = ${ id }`;

      [rows, fields] = await database.getPromise().query(sql, []);

      if (rows.affectedRows !== 1) {
        throw new Error(`Error deleting register, affected rows = ${rows.affectedRows}`);
      }

      return registerToDelete;

    }
  
  };
  
  module.exports = registerService;