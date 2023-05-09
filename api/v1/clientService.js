const mysql = require('mysql2');
const { log } = require('winston');

const database = require(`${__base}api/database`);

const clientService = {
  
  async getClient(id) {

    let sql = `SELECT id, code, CONVERT_TZ(dateStart, '+00:00', @@session.time_zone) AS dateStart, CONVERT_TZ(dateFinal, '+00:00', @@session.time_zone)AS dateFinal, active, token, notes FROM client WHERE id = ?`;

    let [rows, fields] = await database.getPromise().query(sql, [id]);
    
    return rows[0];
  },

  async getClients() {

    let sql = `SELECT id, code, CONVERT_TZ(dateStart, '+00:00', @@session.time_zone) AS dateStart, CONVERT_TZ(dateFinal, '+00:00', @@session.time_zone)AS dateFinal, active, token, notes FROM client`;

    let [rows, fields] = await database.getPromise().query(sql, []);
    return rows;
    
  },

  async postClient(client) {

    let sql = `INSERT INTO client(code, dateStart, dateFinal, active, token, notes)
                VALUES(?, ?, ?, ?, ?, ?)`;
    let values = [
      client.code, 
      client.dateStart, 
      client.dateFinal, 
      client.active, 
      client.token, 
      client.notes];

    let [rows, fields] = await database.getPromise().query(sql, values);

    sql = `SELECT id, code, CONVERT_TZ(dateStart, '+00:00', @@session.time_zone) AS dateStart, CONVERT_TZ(dateFinal, '+00:00', @@session.time_zone)AS dateFinal, active, token, notes FROM client WHERE id = ?`;
    [rows, fields] = await database.getPromise().query(sql, [rows.insertId]);
    
    return rows[0];

  },

  async putClient(id, client) {

    sql = `UPDATE client SET
      code = '${client.code}',
      dateStart = CONVERT_TZ('${client.dateStart}', '+00:00', @@session.time_zone),
      dateFinal = CONVERT_TZ('${client.dateFinal}', '+00:00', @@session.time_zone),
      active = '${ client.active }',
      token = '${client.token}',
      notes = '${client.notes}'
    WHERE id = ${ id }`;

    let [rows, fields] = await database.getPromise().query(sql, []);

    // return undefined if client not found
    if (rows.affectedRows === 0) {
      return undefined;
    }

    if (rows.affectedRows !== 1) {
      throw new Error(`Error updating client, affected rows = ${rows.affectedRows}`);
    }

    sql = `SELECT * FROM client WHERE id = ${id}`;
    [rows, fields] = await database.getPromise().query(sql, []);

    if (rows.length !== 1) {
      throw new Error(`Error retrieving updated client data`);
    }

    return rows[0];

  },

  async deleteClient(id) {

    let sql = `SELECT id, code, CONVERT_TZ(dateStart, '+00:00', @@session.time_zone) AS dateStart, CONVERT_TZ(dateFinal, '+00:00', @@session.time_zone)AS dateFinal, active, token, notes FROM client WHERE id = ?`;
    let [rows, fields] = await database.getPromise().query(sql, [id]);

    if (rows.length !== 1) {
      
      return undefined;
    }

    let clientToDelete = rows[0];
    
    sql = `DELETE FROM client WHERE id = ${ id }`;

    [rows, fields] = await database.getPromise().query(sql, []);

    if (rows.affectedRows !== 1) {
      throw new Error(`Error deleting client, affected rows = ${rows.affectedRows}`);
    }
     
    return clientToDelete;
      
  }
  
}

module.exports = clientService;