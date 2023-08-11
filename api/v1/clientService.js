const mysql = require('mysql2');
const { log } = require('winston');

const database = require(`../../api/database`);
const requestQuery = require(`../../api/requestQuery`);

const DEFAULT_SKIP = 0;
const DEFAULT_LIMIT = 150;

const clientService = {  
  //GET CLIENT per ID
  async getClient(id) {
    let [rows, fields] = await selectClient(id);
    return rows[0];
  },

  //GET ALL CLIENTS
  async getClients(pag, filter, sort) {
    sql=`SELECT id, 
            code, 
            CONVERT_TZ(date_start, '+00:00', @@session.time_zone) AS dateStart, 
            CONVERT_TZ(date_final, '+00:00', @@session.time_zone) AS dateFinal, 
            active, 
            token, 
            notes 
        FROM client ${requestQuery.getWheres(filter)} ${requestQuery.getOrderBy(sort)} ${requestQuery.getLimit(pag)};`;
    let [rows, fields] = await database.getPromise().query(sql);
    return rows;
  },
  
  async getClientsConainersRegisters(pag){
    sql=`SELECT 
            cl.id, 
            cl.code, 
            COUNT(DISTINCT c.id) AS containers,
            COUNT(DISTINCT r.id) AS registers,
            CONVERT_TZ(date_start, '+00:00', @@session.time_zone) AS dateStart,
            CONVERT_TZ(date_final, '+00:00', @@session.time_zone) AS dateFinal,
            active, 
            token, 
            notes 
        FROM client cl
        LEFT JOIN container c ON cl.id = c.client_id
        LEFT JOIN register r ON cl.id = r.client_id
        WHERE cl.deleted_at is NULL
        GROUP BY cl.id 
        ${requestQuery.getLimit(pag)};`;
    let [rows, fields] = await database.getPromise().query(sql);
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
    let sql = `INSERT INTO client(code, date_start, date_final, active, token, notes, deleted_at)
               VALUES(?, 
                      CONVERT_TZ(?, @@session.time_zone, '+00:00'), 
                      CONVERT_TZ(?, @@session.time_zone, '+00:00'), 
                      ?, ?, ?, null)`;
    let active = parseActive(client.active);
    let values = [
      client.code, 
      client.dateStart, 
      client.dateFinal, 
      active, 
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

    let active = parseActive(client.active);
    let dateStart = parseDate(client.dateStart);
    let dateFinal = parseDate(client.dateFinal);
    let values = [
      client.code, 
      dateStart, 
      dateFinal, 
      active, 
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
    
    sql = `DELETE FROM client WHERE id = ?`;
    [rows, fields] = await database.getPromise().query(sql, [id]);

    if (rows.affectedRows < 1) {
      throw new Error(`Error deleting client, affected rows = ${rows.affectedRows}`);
    }
     
    return clientToDelete;
      
  },

  /**
   * Function that set the date value to column delete_at into the client
   * and into the containers/registers from the client
   * @param {*} id 
   * @returns 
   */
  async dateDeleteClient(id) {

    let [rows, fields] = await selectClient(id);

    if (rows.length !== 1) {
      
      return undefined;
    }
    else if(rows[0].deleted_at){
      return 'This client is alredy deleted.'
    }
    let clientToDelete = rows[0];
    sql = `UPDATE client 
    JOIN container ON (client.id = container.client_id) 
    JOIN register ON (client.id = register.client_id) 
    SET client.deleted_at = now(), container.deleted_at = now(), register.deleted_at = now() 
    WHERE client.id = ? AND  container.deleted_at IS NULL AND register.deleted_at IS NULL;`;
    [rows, fields] = await database.getPromise().query(sql, [id]);

    /*if (rows.affectedRows < 1) {
      throw new Error(`Error deleting client, affected rows = ${rows.affectedRows}`);
    }*/
    //console.log(clientToDelete);
    return clientToDelete;
      
  },

  /**
   * Function that validates if the client credentials are válid
   * @param {*} clientId 
   * @param {*} token 
   * @returns 
   */
  async isAuthenticacionValid(clientId, token) {
    let sql = `SELECT token FROM client WHERE id = ?`;
    [rows, fields] = await database.getPromise().query(sql, [clientId]);

    if (rows.length !== 1) {
      return false;
    }

    if (rows[0].token !== token) {
      return false;
    }

    return true;
  },

  /**
   * Funtion that validates if the client has acces to the requested resource
   * @param {*} clientId 
   * @param {*} url 
   * @returns 
   */
  async hasAccessToTheResource(clientId, resource) {
    // TODO: completar amb llistat de URL que té accés el client
    return true;
  }
  
}

/**
 * Function that get one or all clients from database
 * The datetime fields are converted UTC to session.time_zone
 * @param {*} id 
 * @returns 
 */
async function selectClient(id, skip, limit) {
  let sql = `SELECT id, 
                    code, 
                    CONVERT_TZ(date_start, '+00:00', @@session.time_zone) AS dateStart, 
                    CONVERT_TZ(date_final, '+00:00', @@session.time_zone) AS dateFinal, 
                    active, 
                    token, 
                    notes,
                    deleted_at
              FROM client `;
  if (id) {
    sql += `WHERE id = ${id} `;
  }
  sql += `LIMIT ?,?;`;
  //console.log('-----------Query '+ sql);
  return await database.getPromise().query(sql, [skip || DEFAULT_SKIP, limit || DEFAULT_LIMIT]);
}

function parseActive(active) {
  if (active == 1) return 1;    // Can be a string "1" or a integer
  if (active === 'on') return 1;
  if (active === true) return 1;
  return 0;
}

function parseDate(date) {
  if (date === '') return null;
  if (date === null) return null;
  if (date === undefined) return null;
  return date;
}

module.exports = clientService;