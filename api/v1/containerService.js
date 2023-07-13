const mysql = require('mysql2');
const { log } = require('winston');

const database = require(`${__base}api/database`);
const DEFAULT_SKIP = 0;
const DEFAULT_LIMIT = 1000;

const containerService = {

  async getContainer(id) {
    //let sql = `SELECT id, client_id as clientId, code, description, width, length, height, max_weight as maxWeight FROM container WHERE id = ?`;
    //let [rows, fields] = await database.getPromise().query(sql, [id]);
    let [rows, fields] = await selectContainer(id);

    return rows[0];
    
  },
  
  async getContainers(skip, limit) {
    //let sql = `SELECT id, client_id as clientId, code, description, width, length, height, max_weight as maxWeight FROM container`;
    //let [rows, fields] = await database.getPromise().query(sql, []);

    let [rows, fields] = await selectContainer(null, skip, limit);

    return rows;

  },

  async getClientContainers(clientId, skip, limit) {
    let sql = `SELECT id, client_id as clientId, code, description, width, length, height, max_weight as maxWeight 
    FROM container WHERE client_id = ?`;
    
    let [rows, fields] = await database.getPromise().query(sql, [clientId]);
    return rows;
    //return containers.filter(c => c.clientId == clientId);
  },

  async postContainer(container){

    let sql = `INSERT INTO container(client_id, code, description, width, length, height, max_weight)
              VALUES(?, ?, ?, ?, ?, ?, ?)`;
    
    let values = [
      container.clientId,
      container.code,
      container.description,
      container.width,
      container.length,
      container.height,
      container.maxWeight
    ];

    let [rows, fields] = await database.getPromise().query(sql, values);

    //sql = `SELECT id, client_id as clientId, code, description, width, length, height, max_weight as maxWeight FROM container WHERE id = ?`;
    //[rows, fields] = await database.getPromise().query(sql, [rows.insertId]);
    [rows, fields] = await selectContainer(rows.insertId);

    return rows[0];

  },

  async putContainer(id, newContainerData) {

    sql = `UPDATE container SET
      code = '${newContainerData.code}',
      description = '${newContainerData.description}',
      width = '${newContainerData.width}',
      length = '${newContainerData.length}',
      height = '${newContainerData.height}',
      max_weight = '${newContainerData.maxWeight}'
    WHERE id = ${id}`;

    let [rows, fields] = await database.getPromise().query(sql, []);

    // return undefined if client not found
    if (rows.affectedRows === 0) {
      return undefined;
    }

    if (rows.affectedRows !== 1) {
      throw new Error(`Error updating client, affected rows = ${rows.affectedRows}`);
    }

    //sql = `SELECT id, client_id as clientId, code, description, width, length, height, max_weight as maxWeight FROM container WHERE id = ${id}`;
    //[rows, fields] = await database.getPromise().query(sql, []);
    [rows, fields] = await selectContainer(id);

    if (rows.length !== 1) {
      throw new Error(`Error retrieving updated client data`);
    }

    return rows[0];

  },

  async deleteContainer(id) {

    //let sql = `SELECT id, client_id as clientId, code, description, width, length, height, max_weight as maxWeight FROM container WHERE id = ?`;
    //let [rows, fields] = await database.getPromise().query(sql, [id]);
    let [rows, fields] = await selectContainer(id);

    if (rows.length !== 1) {
      
      return undefined;
    }

    let containerToDelete = rows[0];
    
    sql = `DELETE FROM container WHERE id = ${ id }`;

    [rows, fields] = await database.getPromise().query(sql, []);

    if (rows.affectedRows !== 1) {
      throw new Error(`Error deleting container, affected rows = ${rows.affectedRows}`);
    }
     
    return containerToDelete;

  }

};

async function selectContainer(id, skip, limit) {
  let sql = `SELECT id, client_id as clientId, code, description, width, length, height, max_weight as maxWeight FROM container`;
  if (id) {
    sql += ` WHERE id = ?`;
  }
  sql += ` LIMIT ${skip || DEFAULT_SKIP},${limit || DEFAULT_LIMIT}`;

  return await database.getPromise().query(sql, [id]);
}

module.exports = containerService;