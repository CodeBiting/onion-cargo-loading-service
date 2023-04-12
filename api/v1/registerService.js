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


  
  const registerService = {

    getRegister(id) {
      let sql = `SELECT * FROM register WHERE id = ${id}`;

      database.get().query(sql, [], function(err, rows) {
        if (err) {
            return done(err);
        } else {
            done(null, rows);
        }
      });
      // if(id == ""){
      //   return undefined;
      // }else{
      //   return registers.find(o => o.id == id);
      // }
    },

    getRegisters() {
      let sql = `SELECT * FROM register`;
      database.get().query(sql, [], function(err, rows) {
        if (err) {
            return done(err);
        } else {
            done(null, rows);
        }
      });
      //return registers;
    },
    
    postRegister(register){
      let sql = `INSERT INTO register (date, origin, destiny, method, status, requestBody, responseData)
                VALUES('${register.date}', '${register.origin}', '${register.destiny}', '${ register.method}',
                '${register.status}', '${register.requestBody}', '${register.responseData}')`;
      database.get().query(sql, [], function(err, rows) {
        if (err) {
            return done(err);
        } else {
            done(null, rows);
        }
      });
      // const nextId = registers.reduce((maxId, register) => Math.max(maxId, register.id), 0) + 1;
      // registers.push({ ...register, id: nextId });
      // return registers[registers.length-1];
  
    },
  
    putRegister(id, newRegisterData) {
      let sql = `UPDATE register SET
      date = '${newRegisterData.date}',
      origin = '${newRegisterData.origin}',
      destiny = '${newRegisterData.destiny}',
      method = '${ newRegisterData.method }',
      status = '${newRegisterData.status}',
      requestBody = '${newRegisterData.requestBody}',
      responseData = '${newRegisterData.responseData}'
      WHERE id = ${ id }`;
      database.get().query(sql, [], function(err, rows) {
        if (err) {
            return done(err);
        } else {
            done(null, rows);
        }
      });
      // const registerToUpdate = registers.find(register => register.id == id);
      // if (registerToUpdate) {
      //   registerToUpdate.date = newRegisterData.date || registerToUpdate.date;
      //   registerToUpdate.origin = newRegisterData.origin || registerToUpdate.origin;
      //   registerToUpdate.destiny = newRegisterData.destiny || registerToUpdate.destiny;
      //   registerToUpdate.method = newRegisterData.method || registerToUpdate.method;
      //   registerToUpdate.status = newRegisterData.status || registerToUpdate.status;
      //   registerToUpdate.requestBody = newRegisterData.requestBody || registerToUpdate.requestBody; 
      //   registerToUpdate.responseData = newRegisterData.responseData || registerToUpdate.responseData;
      // }
      // return registerToUpdate;
    },
  
    deleteRegister(id) {
      let sql = `DELETE FROM register WHERE id = ${ id }`;
      database.get().query(sql, [], function(err, rows) {
        if (err) {
            return done(err);
        } else {
            done(null, rows);
        }
      });
      // const index = registers.findIndex(o => o.id == id); 
      // if (index >= 0) {
      //   let registerDeleted = registers.splice(index, 1); 
      //   return registerDeleted[0];
      // } else {
      //   return undefined; 
      // }
    }
  
  };
  
  module.exports = registerService;