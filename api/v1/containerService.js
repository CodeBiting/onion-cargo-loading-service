const mysql = require('mysql2');
const { log } = require('winston');

const database = require(`${__base}api/database`);

const containerService = {

  async getContainer(id) {
    let sql = `SELECT * FROM container WHERE id = ?`;

    let [rows, fields] = await database.getPromise().query(sql, [id]);

    return rows[0];
    
  },
  
  async getContainers() {
    let sql = `SELECT * FROM container`;

    let [rows, fields] = await database.getPromise().query(sql, []);
    return rows;

  },

  async getClientContainers(clientId) {
    let sql = `SELECT * FROM container WHERE id = ?`;
    
    let [rows, fields] = await database.getPromise().query(sql, [clientId]);
    return rows;
    //return containers.filter(c => c.clientId == clientId);
  },

  async postContainer(container){

    let sql = `INSERT INTO container(clientId, code, description, width, length, height, maxWeight)
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

    sql = `SELECT * FROM container WHERE id = ?`;
    [rows, fields] = await database.getPromise().query(sql, [rows.insertId]);

    return rows[0];

  },

  async putContainer(id, newContainerData) {

    sql = `UPDATE container SET
      code = '${newContainerData.code}',
      description = '${newContainerData.description}',
      width = '${newContainerData.width}',
      length = '${newContainerData.length}',
      height = '${newContainerData.height}',
      maxWeight = '${newContainerData.maxWeight}'
    WHERE id = ${id}`;

    let [rows, fields] = await database.getPromise().query(sql, []);

    // return undefined if client not found
    if (rows.affectedRows === 0) {
      return undefined;
    }

    if (rows.affectedRows !== 1) {
      throw new Error(`Error updating client, affected rows = ${rows.affectedRows}`);
    }

    sql = `SELECT * FROM container WHERE id = ${id}`;
    [rows, fields] = await database.getPromise().query(sql, []);

    if (rows.length !== 1) {
      throw new Error(`Error retrieving updated client data`);
    }

    return rows[0];

  },

  async deleteContainer(id) {

    let sql = `SELECT * FROM container WHERE id = ?`;
    let [rows, fields] = await database.getPromise().query(sql, [id]);

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

module.exports = containerService;