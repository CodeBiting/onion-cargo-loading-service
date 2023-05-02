const mysql = require('mysql2');
const { log } = require('winston');

const database = require(`${__base}api/database`);

const containerService = {

  async getContainer(id) {
    let sql = `SELECT * FROM container WHERE id = ${id}`;

    let [rows, fields] = await database.getPromise().query(sql, []);
    console.log(rows);
    return rows[0];
    
  },
  
  async getContainers() {
    let sql = `SELECT * FROM container`;

    let [rows, fields] = await database.getPromise().query(sql, []);
    return rows;

  },

  async getClientContainers(clientId) {
    let sql = `SELECT * FROM container WHERE id = ${clientId}`;
    
    let [rows, fields] = await database.getPromise().query(sql, []);
    return rows;
    //return containers.filter(c => c.clientId == clientId);
  },

  async postContainer(container){

    let sql = `INSERT INTO container(clientId, code, description, width, length, height, maxWeight)
                VALUES('${container.clientId}', '${container.code}', '${container.description}', '${container.width}',
                 '${ container.length }', '${container.height}', '${container.maxWeight}')`;

    let [rows, fields] = await database.getPromise().query(sql, []);
    return rows;
    // const nextId = containers.reduce((maxId, container) => Math.max(maxId, container.id), 0) + 1;
    // containers.push({ ...container, id: nextId });
    // return containers[containers.length-1];

  },

  async putContainer(id, newContainerData) {

    let sql = `UPDATE container SET
      clientId = '${newContainerData.clientId}',
      code = '${newContainerData.code}',
      description = '${newContainerData.description}',
      width = '${newContainerData.width}',
      length = '${ newContainerData.length }',
      height = '${newContainerData.height}',
      maxWeight = '${newContainerData.maxWeight}'
    WHERE id = ${ id }`;

    let [rows, fields] = await database.getPromise().query(sql, []);
    return rows;
    // const containerToUpdate = containers.find(container => container.id == id);
    // if (containerToUpdate) {
    //   containerToUpdate.clientId = newContainerData.clientId || containerToUpdate.clientId;
    //   containerToUpdate.code = newContainerData.code || containerToUpdate.code;
    //   containerToUpdate.description = newContainerData.description || containerToUpdate.description;
    //   containerToUpdate.width = newContainerData.width || containerToUpdate.width;
    //   containerToUpdate.length = newContainerData.length || containerToUpdate.length;
    //   containerToUpdate.height = newContainerData.height || containerToUpdate.height;
    //   containerToUpdate.maxWeight = newContainerData.maxWeight || containerToUpdate.maxWeight;
    // }
    // return containerToUpdate;
  },

  async deleteContainer(id) {

    let sql = `DELETE FROM container WHERE id = ${ id }`;

    let [rows, fields] = await database.getPromise().query(sql, []);
    return rows;
    // const index = containers.findIndex(o => o.id == id); 
    // if (index >= 0) {
    //   let conatinerDeleted = containers.splice(index, 1); 
    //   return conatinerDeleted[0];
    // } else {
    //   return undefined; 
    // }
  }

};

module.exports = containerService;