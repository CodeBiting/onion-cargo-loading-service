const mysql = require('mysql2');

const database = require(`${__base}api/database`);


const clientService = {
  getClient(id) {

    // return pool.promise().query(`SELECT * FROM client WHERE id = ${id}`)
    //   .then(([rows]) => {
    //     return rows[0];
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });-

    let sql = `SELECT * FROM client WHERE id = ${id}`;

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
    // // Comparem amb == ja que l'id que rebem és un string
    // return clients.find(o => o.id == id);
    // }
  },

  getClients() {
    //return clients;
    let sql = `SELECT * FROM client`;
    database.get().query(sql, [], function(err, rows) {
      if (err) {
          return done(err);
      } else {
          done(null, rows);
      }
    });
    
      
  },

  postClient(client) {
    let sql = `INSERT INTO client(code, date_start, date_final, active, token, notes)
                VALUES('${client.code}', '${client.dateStart}', '${client.dateFinal}', '${ client.active }', '${client.token}', '${client.notes}')`;
    //let values = `VALUES('${client.code}', '${client.dateStart}', '${client.dateFinal}', ${ client.active }, '${client.token}', '${client.notes}')`;

    database.get().query(sql, [], function(err, rows) {
      if (err) {
          return done(err);
      } else {
          done(null, rows);
      }
    });

    // const nextId = clients.reduce((maxId, client) => Math.max(maxId, client.id), 0) + 1;
    // clients.push({ ...client, id: nextId });
    // return clients[clients.length-1];

  },

  putClient(id, client) {
    let sql = `UPDATE client SET
    code = '${client.code}',
      date_start = '${client.dateStart}',
      date_final = '${client.dateFinal}',
      active = '${ client.active }',
      token = '${client.token}',
      notes = '${client.notes}'
    WHERE id = ${ id }`;

    database.get().query(sql, [], function(err, rows) {
      if (err) {
          return done(err);
      } else {
          done(null, rows);
      }
    });

    // const clientToUpdate = clients.find(client => client.id == id);
    // if (clientToUpdate) {
    //   clientToUpdate.code = client.code || clientToUpdate.code;
    //   clientToUpdate.dateStart = client.dateStart || clientToUpdate.dateStart;
    //   clientToUpdate.dateFinal = client.dateFinal || clientToUpdate.dateFinal;
    //   clientToUpdate.active = client.active || clientToUpdate.active;
    //   clientToUpdate.token = client.token || clientToUpdate.token;
    //   clientToUpdate.notes = client.notes || clientToUpdate.notes; 
    // }
    // return clientToUpdate;
  },

  deleteClient(id) {
    let sql = `DELETE FROM client WHERE id = ${ id }`;

    database.get().query(sql, [], function(err, rows) {
      if (err) {
          return done(err);
      } else {
          done(null, rows);
      }
    });

    // const index = clients.findIndex(o => o.id == id); 
    // if (index >= 0) {
    //   let clientDeleted = clients.splice(index, 1); 
    //   return clientDeleted[0];
    // } else {
    //   return undefined; 
    // }
  }
};

module.exports = clientService;