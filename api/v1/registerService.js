const database = require('../../api/database');
const requestQuery = require('../../api/requestQuery');
const DEFAULT_SKIP = 0;
const DEFAULT_LIMIT = 150;

const registerService = {

  // GET ONE Register
  async getRegister (id) {
    const [rows] = await selectRegister(id);
    return rows[0];
  },

  // GET ALL Registers
  async getRegisters (pag, filter, sort) {
    const sql = `SELECT id, 
            client_id as clientId, 
            CONVERT_TZ(date, '+00:00', @@session.time_zone) AS date, 
            origin, 
            destiny, 
            method, 
            request_id as requestId, 
            status, 
            request_body as requestBody, 
            response_data as responseData 
        FROM register  ${requestQuery.getWheres(filter)} ${requestQuery.getOrderBy(sort)} ${requestQuery.getLimit(pag)};`;
    const [rows] = await database.getPromise().query(sql);
    return rows;
  },

  /**
   * Creates a register into database
   * The datetime fields are converted from session.time_zone to UTC
   * @param {*} register :
   * - date : date time in format 'YYYY-MM-DD hh:mm:ss' in local date time
   * @returns
   */
  async postRegister (register) {
    const sql = `INSERT INTO register (client_id, date, origin, destiny, method, request_id, status, request_body, response_data, deleted_at)
              VALUES(?, CONVERT_TZ(?, @@session.time_zone, '+00:00'), ?, ?, ?, ?, ?, ?, ?, null)`;
    const values = [
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
    let [rows] = await database.getPromise().query(sql, values);
    [rows] = await selectRegister(rows.insertId);
    return rows[0];
  },

  /**
   * The datetime fields are converted from session.time_zone to UTC
   * @param {*} id
   * @param {*} newRegisterData
   * @returns
   */
  async putRegister (id, newRegisterData) {
    const sql = `UPDATE register SET
            client_id = ?,
            date = CONVERT_TZ(?, @@session.time_zone, '+00:00'),
            origin = ?,
            destiny = ?,
            method = ?,
            request_id = ?,
            status = ?,
            request_body = ?,
            response_data = ?
          WHERE id = ?`;
    const values = [
      newRegisterData.clientId,
      newRegisterData.date,
      newRegisterData.origin,
      newRegisterData.destiny,
      newRegisterData.method,
      newRegisterData.requestId,
      newRegisterData.status,
      newRegisterData.requestBody,
      newRegisterData.responseData,
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

    [rows] = await selectRegister(id);
    if (rows.length !== 1) {
      throw new Error('Error retrieving updated client data');
    }

    return rows[0];
  },

  async deleteRegister (id) {
    let [rows] = await selectRegister(id);
    if (rows.length !== 1) {
      return undefined;
    }

    const registerToDelete = rows[0];
    const sql = `DELETE FROM register WHERE id = ${id}`;
    [rows] = await database.getPromise().query(sql, []);

    if (rows.affectedRows !== 1) {
      throw new Error(`Error deleting register, affected rows = ${rows.affectedRows}`);
    }

    return registerToDelete;
  },

  async dateDeleteRegister (id) {
    let [rows] = await selectRegister(id);
    if (rows.length !== 1) {
      return undefined;
    } else if (rows[0].deleted_at) {
      return 'This register is alredy deleted.';
    }
    const registerToDelete = rows[0];
    const sql = `UPDATE register SET deleted_at = now() WHERE id = ${id}`;
    [rows] = await database.getPromise().query(sql, []);
    if (rows.affectedRows !== 1) {
      throw new Error(`Error deleting register, affected rows = ${rows.affectedRows}`);
    }
    return registerToDelete;
  }
};

/**
 * Function that get one or all registers from database
 * The datetime fields are converted UTC to session.time_zone
 * @param {*} id
 * @returns
 */
async function selectRegister (id, skip, limit) {
  let sql = `SELECT id, 
                    client_id as clientId, 
                    CONVERT_TZ(date, '+00:00', @@session.time_zone) AS date, 
                    origin, 
                    destiny, 
                    method, 
                    request_id as requestId, 
                    status, 
                    request_body as requestBody, 
                    response_data as responseData,
                    deleted_at
             FROM register `;
  if (id) {
    sql += `WHERE id = ${id} `;
  }
  sql += `LIMIT ${skip || DEFAULT_SKIP},${limit || DEFAULT_LIMIT};`;
  // console.log('-----------Query '+ sql);
  return await database.getPromise().query(sql, [id]);
}

module.exports = registerService;
