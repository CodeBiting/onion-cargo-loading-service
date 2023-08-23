const database = require('../../api/database');
const requestQuery = require('../../api/requestQuery');

const DEFAULT_SKIP = 0;
const DEFAULT_LIMIT = 150;

const clientService = {
  // GET CLIENT per ID
  async getClient (id) {
    const [rows] = await selectClient(id);
    return rows[0];
  },

  // GET ALL CLIENTS
  async getClients (pag, filter, sort) {
    const sql = `SELECT id, 
            code, 
            CONVERT_TZ(date_start, '+00:00', @@session.time_zone) AS dateStart, 
            CONVERT_TZ(date_final, '+00:00', @@session.time_zone) AS dateFinal, 
            active, 
            token, 
            notes,
            deleted_at 
        FROM client ${requestQuery.getWheres(filter)} ${requestQuery.getOrderBy(sort)} ${requestQuery.getLimit(pag)};`;
    const [rows] = await database.getPromise().query(sql);
    return rows;
  },

  async getClientsConainersRegisters (pag) {
    const sql = `SELECT 
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
    const [rows] = await database.getPromise().query(sql);
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
  async postClient (client) {
    const sql = `INSERT INTO client(code, date_start, date_final, active, token, notes, deleted_at)
               VALUES(?,
                CONVERT_TZ(?, @@session.time_zone, '+00:00'),
                CONVERT_TZ(?, @@session.time_zone, '+00:00'),
                ?, ?, ?, null)`;
    if (!client.code) {
      throw new Error('Error creating client, the client code was null');
    }
    const dateStart = parseDate(client.dateStart);
    const dateFinal = parseDate(client.dateFinal);
    let token;
    if (!client.token) token = null;
    else token = client.token;

    const values = [
      client.code,
      dateStart,
      dateFinal,
      1,
      token,
      client.notes
    ];

    let [rows] = await database.getPromise().query(sql, values);

    [rows] = await selectClient(rows.insertId);
    console.log('VALUES:' + values);
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
  async putClient (id, client) {
    const sql = `UPDATE client SET
      code = ?,
      date_start = CONVERT_TZ(?, @@session.time_zone, '+00:00'),
      date_final = CONVERT_TZ(?, @@session.time_zone, '+00:00'),
      active = ?,
      token = ?,
      notes = ?
    WHERE id = ?`;

    const active = parseActive(client.active);
    const dateStart = parseDate(client.dateStart);
    const dateFinal = parseDate(client.dateFinal);
    const values = [
      client.code,
      dateStart,
      dateFinal,
      active,
      client.token,
      client.notes,
      id
    ];

    let [rows] = await database.getPromise().query(sql, values);

    // return undefined if client not found
    if (rows.affectedRows === 0) {
      return undefined;
    }

    if (rows.affectedRows !== 1) {
      throw new Error(`Error updating client, affected rows = ${rows.affectedRows}`);
    }

    [rows] = await selectClient(id);

    if (rows.length !== 1) {
      throw new Error('Error retrieving updated client data');
    }

    return rows[0];
  },

  async deleteClient (id) {
    let [rows] = await selectClient(id);

    if (rows.length !== 1) {
      return undefined;
    }

    const clientToDelete = rows[0];

    const sql = 'DELETE FROM client WHERE id = ?;';
    [rows] = await database.getPromise().query(sql, [id]);

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
  async desactivateClient (id, containers, registers) {
    let [rows] = await selectClient(id);

    if (rows.length !== 1) {
      return undefined;
    } else if (rows[0].deleted_at) {
      return 'This client is alredy been desactivated.';
    }

    const clientToDelete = rows[0];
    let sql = 'UPDATE client ';
    if (containers) sql += 'JOIN container ON (client.id = container.client_id) ';
    if (registers) sql += 'JOIN register ON (client.id = register.client_id) ';
    sql += 'SET client.deleted_at = now()';
    if (containers) sql += ', container.deleted_at = now()';
    if (registers) sql += ', register.deleted_at = now()';
    sql += ' WHERE client.id = ?';
    if (containers) sql += ' AND container.deleted_at IS NULL';
    if (registers) sql += ' AND register.deleted_at IS NULL';
    sql += ';';
    [rows] = await database.getPromise().query(sql, [id]);
    return clientToDelete;
  },

  async activateClient (id, containers, registers) {
    let [rows] = await selectClient(id);

    if (rows.length !== 1) {
      return undefined;
    }

    const clientToAct = rows[0];

    let sql = 'UPDATE client ';
    if (containers) sql += 'JOIN container ON (client.id = container.client_id) ';
    if (registers) sql += 'JOIN register ON (client.id = register.client_id) ';
    sql += 'SET client.deleted_at = NULL';
    if (containers) sql += ', container.deleted_at = NULL';
    if (registers) sql += ', register.deleted_at = NULL';
    sql += ' WHERE client.id = ?;';

    [rows] = await database.getPromise().query(sql, [id]);

    if (rows.affectedRows < 1) {
      throw new Error(`Error activating client, affected rows = ${rows.affectedRows}`);
    }

    return clientToAct;
  },

  /**
   * Function that validates if the client credentials are válid
   * @param {*} clientId
   * @param {*} token
   * @returns
   */
  async isAuthenticacionValid (clientId, token) {
    const sql = 'SELECT token FROM client WHERE id = ?';
    const [rows] = await database.getPromise().query(sql, [clientId]);

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
  async hasAccessToTheResource (clientId, resource) {
    // TODO: completar amb llistat de URL que té accés el client
    return true;
  }
};

/**
 * Function that get one or all clients from database
 * The datetime fields are converted UTC to session.time_zone
 * @param {*} id
 * @returns
 */
async function selectClient (id, skip, limit) {
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
  sql += 'LIMIT ?,?;';
  // console.log('-----------Query '+ sql);
  return await database.getPromise().query(sql, [skip || DEFAULT_SKIP, limit || DEFAULT_LIMIT]);
}

function parseActive (active) {
  if (active === 1 || active === '1') return 1; // Can be a string "1" or a integer
  if (active === 'on') return 1;
  if (active === true) return 1;
  return 0;
}

function parseDate (date) {
  if (date === '') return null;
  if (date === null) return null;
  if (date === undefined) return null;
  return date;
}

module.exports = clientService;
