var config = require(`${__base}config/config`);
var database = require(`${__base}api/database`);
database.connect(config.db, function(err) {
    if (err) {
        console.log('Unable to connect to MySQL: ' + err);
        process.exit(1);
    } else {
        console.log(`Connected to MySQL ${config.db.database} successfully`);
    }
});

// Create the connection pool. The pool-specific settings are the defaults
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   database: 'code_biting',
//   waitForConnections: true,
//   connectionLimit: 10,
//   maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
//   idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
//   queueLimit: 0
// });



const containerService = {

  getContainer(id) {
    let sql = `SELECT * FROM container WHERE id = ${id}`;

    database.get().query(sql, [], function(err, rows) {
      if (err) {
          return done(err);
      } else {
          done(null, rows);
      }
    });
    // if (id == "") {
    //   return undefined;
    // } else {
    //   // Comparem amb == ja que l'id que rebem és un string
    //   return containers.find(o => o.id == id);
    // }
  },
  
  getContainers() {
    let sql = `SELECT * FROM container`;

    database.get().query(sql, [], function(err, rows) {
      if (err) {
          return done(err);
      } else {
          done(null, rows);
      }
    });
    //return containers;
  },

  getClientContainers(clientId) {
    let sql = `SELECT * FROM container WHERE id = ${clientId}`;
    
    database.get().query(sql, [], function(err, rows) {
      if (err) {
          return done(err);
      } else {
          done(null, rows);
      }
    });
    //return containers.filter(c => c.clientId == clientId);
  },

  postContainer(container){
    let sql = `INSERT INTO container(clientId, code, description, width, length, height, maxWeight)
                VALUES('${container.clientId}', '${container.code}', '${container.description}', '${container.width}',
                 '${ container.length }', '${container.height}', '${container.maxWeight}')`;
    database.get().query(sql, [], function(err, rows) {
      if (err) {
          return done(err);
      } else {
          done(null, rows);
      }
    });
    // const nextId = containers.reduce((maxId, container) => Math.max(maxId, container.id), 0) + 1;
    // containers.push({ ...container, id: nextId });
    // return containers[containers.length-1];

  },

  putContainer(id, newContainerData) {
    let sql = `UPDATE container SET
      clientId = '${newContainerData.clientId}',
      code = '${newContainerData.code}',
      description = '${newContainerData.description}',
      width = '${newContainerData.width}',
      length = '${ newContainerData.length }',
      height = '${newContainerData.height}',
      maxWeight = '${newContainerData.maxWeight}'
    WHERE id = ${ id }`;
    database.get().query(sql, [], function(err, rows) {
      if (err) {
          return done(err);
      } else {
          done(null, rows);
      }
    });
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

  deleteContainer(id) {
    let sql = `DELETE FROM container WHERE id = ${ id }`;
    database.get().query(sql, [], function(err, rows) {
      if (err) {
          return done(err);
      } else {
          done(null, rows);
      }
    });
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