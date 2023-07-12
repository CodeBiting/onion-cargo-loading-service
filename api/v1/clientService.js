const mysql = require('mysql2');
const { log } = require('winston');

const database = require(`${__base}api/database`);

const clientService = {
  
  async getClient(id) {
    let [rows, fields] = await selectClient(id);
    return rows[0];
  },

  async getClients() {
    let [rows, fields] = await selectClient();
    return rows;
    
  },

  /**
   * Function that creates a client into the database
   * The datetime fields are converted from session.time_zone to UTC
   * @param {*} client 
   * - client.dateStart : date time in format 'YYYY-MM-DD hh:mm:ss' in local date time
   * - client.dateEnd : date time in format 'YYYY-MM-DD hh:mm:ss' in local date time
   * @returns 
   */
  async postClient(client) {
    let sql = `INSERT INTO client(code, date_start, date_final, active, token, notes)
               VALUES(?, 
                      CONVERT_TZ(?, @@session.time_zone, '+00:00'), 
                      CONVERT_TZ(?, @@session.time_zone, '+00:00'), 
                      ?, ?, ?)`;
    let values = [
      client.code, 
      client.dateStart, 
      client.dateFinal, 
      client.active, 
      client.token, 
      client.notes];

    let [rows, fields] = await database.getPromise().query(sql, values);

    [rows, fields] = await selectClient(rows.insertId);
    
    return rows[0];

  },

  /**
   * The datetime fields are converted from session.time_zone to UTC
   * @param {*} id 
   * @param {*} client 
   * - client.dateStart : date time in format 'YYYY-MM-DD hh:mm:ss'
   * - client.dateEnd : date time in format 'YYYY-MM-DD hh:mm:ss'
   * @returns 
   */
  async putClient(id, client) {

    sql = `UPDATE client SET
      code = ?,
      date_start = CONVERT_TZ(?, @@session.time_zone, '+00:00'),
      date_final = CONVERT_TZ(?, @@session.time_zone, '+00:00'),
      active = ?,
      token = ?,
      notes = ?
    WHERE id = ?`;

    let values = [
      client.code, 
      client.dateStart, 
      client.dateFinal, 
      client.active, 
      client.token, 
      client.notes,
      id
    ];

    let [rows, fields] = await database.getPromise().query(sql, values);

    // return undefined if client not found
    if (rows.affectedRows === 0) {
      return undefined;
    }

    if (rows.affectedRows !== 1) {
      throw new Error(`Error updating client, affected rows = ${rows.affectedRows}`);
    }

    [rows, fields] = await selectClient(id);

    if (rows.length !== 1) {
      throw new Error(`Error retrieving updated client data`);
    }

    return rows[0];

  },

  async deleteClient(id) {

    let [rows, fields] = await selectClient(id);

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

/**
 * Function that get one or all clients from database
 * The datetime fields are converted UTC to session.time_zone
 * @param {*} id 
 * @returns 
 */
async function selectClient(id) {
  let sql = `SELECT id, code, CONVERT_TZ(date_start, '+00:00', @@session.time_zone) AS dateStart, CONVERT_TZ(date_final, '+00:00', @@session.time_zone)AS dateFinal, active, token, notes FROM client`;
  if (id) {
    sql = sql + ` WHERE id = ?`;
  }
  return await database.getPromise().query(sql, [id]);
}

module.exports = clientService;