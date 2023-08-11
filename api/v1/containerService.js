const database = require('../../api/database');
const requestQuery = require('../../api/requestQuery');
const DEFAULT_SKIP = 0;
const DEFAULT_LIMIT = 150;

const containerService = {

  // GET ONE Container
  async getContainer (id) {
    const [rows] = await selectContainer(id);
    return rows[0];
  },

  // GET ALL Containers
  async getContainers (pag, filter, sort) {
    const sql = `SELECT id, 
          client_id as clientId, 
          code, 
          description, 
          width, 
          length, 
          height, 
          max_weight as maxWeight 
        FROM container  ${requestQuery.getWheres(filter)} ${requestQuery.getOrderBy(sort)} ${requestQuery.getLimit(pag)};`;
    const [rows] = await database.getPromise().query(sql);
    return rows;
  },

  // GET ALL Containers FROM ONE Client
  async getClientContainers (clientId, skip, limit) {
    const [rows] = await selectContainer(null, clientId, skip, limit);
    return rows;
  },

  // CREATE NEW Container
  async postContainer (container) {
    const sql = 'INSERT INTO container(client_id, code, description, width, length, height, max_weight, deleted_at) ' +
              'VALUES(?, ?, ?, ?, ?, ?, ?, null)';

    const values = [
      container.clientId,
      container.code,
      container.description,
      container.width,
      container.length,
      container.height,
      container.maxWeight
    ];

    let [rows] = await database.getPromise().query(sql, values);
    [rows] = await selectContainer(rows.insertId);
    return rows[0];
  },

  async putContainer (id, newContainerData) {
    const sql = `UPDATE container SET
      code = '${newContainerData.code}',
      description = '${newContainerData.description}',
      width = '${newContainerData.width}',
      length = '${newContainerData.length}',
      height = '${newContainerData.height}',
      max_weight = '${newContainerData.maxWeight}'
    WHERE id = ${id}`;

    let [rows] = await database.getPromise().query(sql, []);
    // return undefined if client not found
    if (rows.affectedRows === 0) {
      return undefined;
    }
    if (rows.affectedRows !== 1) {
      throw new Error(`Error updating client, affected rows = ${rows.affectedRows}`);
    }

    [rows] = await selectContainer(id);
    if (rows.length !== 1) {
      throw new Error('Error retrieving updated client data');
    }

    return rows[0];
  },

  async deleteContainer (id) {
    let [rows] = await selectContainer(id);

    if (rows.length !== 1) {
      return undefined;
    }

    const containerToDelete = rows[0];
    const sql = `DELETE FROM container WHERE id = ${id}`;
    [rows] = await database.getPromise().query(sql, []);

    if (rows.affectedRows !== 1) {
      throw new Error(`Error deleting container, affected rows = ${rows.affectedRows}`);
    }

    return containerToDelete;
  },

  async dateDeleteContainer (id) {
    let [rows] = await selectContainer(id);

    if (rows.length !== 1) {
      return undefined;
    } else if (rows[0].deleted_at) {
      return 'This Container is alredy deleted.';
    }

    const containerToDelete = rows[0];
    const sql = `UPDATE container SET deleted_at = now() WHERE id = ${id}`;
    [rows] = await database.getPromise().query(sql, []);
    if (rows.affectedRows !== 1) {
      throw new Error(`Error deleting container, affected rows = ${rows.affectedRows}`);
    }
    return containerToDelete;
  },

  async selectContainerForVolumeAnalysis (clientId) {
    const sql = `SELECT id, 
                      client_id as clientId, 
                      code, 
                      description, 
                      width as x, 
                      length as y, 
                      height as z, 
                      max_weight as maxWeight,
                      (width*length*height)/1000000 as volume
                FROM container 
                WHERE client_id = ?
                ORDER BY (width*length*height) ASC;`;
    const [rows] = await database.getPromise().query(sql, [clientId]);
    return rows;
  }
};

async function selectContainer (id, clientId, skip, limit) {
  let sql = `SELECT id, 
                    client_id as clientId, 
                    code, 
                    description, 
                    width, 
                    length, 
                    height, 
                    max_weight as maxWeight,
                    deleted_at 
              FROM container `;
  if (clientId) {
    sql += `WHERE client_id = ${clientId}`;
  } else if (id) {
    sql += `WHERE id = ${id}`;
  }
  sql += ` LIMIT ${skip || DEFAULT_SKIP},${limit || DEFAULT_LIMIT};`;
  return await database.getPromise().query(sql, [id]);
};

module.exports = containerService;
