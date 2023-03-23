const logger = require("../../api/logger");

let users = [
    {
      id: 1,
      code: 'User1',
      description: 'Usuari 1',
      width: 1,
      length: 1,
      height: 1,
      maxWeight: 1,
    }
];

const userService = {
  getUser(id) {
      // Comparem amb == ja que l'id que rebem és un string
      return users.find(o => o.id == id);
  },

  getUsers() {
  return users;
  },

  postUser(user) {
      let maxId = 0;
      for(let i=0; i<users.length; i++) {
        if (users[i].id > maxId) {
          maxId = users[i].id;
        }
      }
      maxId++;
      user.id = maxId;
      console.log(user);
      users.push(user);
  },
  putUser(id, user) {
    let userFound = users.find(o => o.id == id);
    if (userFound) {
      userFound.code = user.code;
      userFound.description = user.description;
      userFound.width = user.width;
      userFound.length = user.length;
      userFound.height = user.height;
      userFound.maxWeight = user.maxWeight;
    } else {
      throw new Error(`User with id=${id} not found`);
    }
  },
  deleteUser(id) {
    let userFound = users.find(o => o.id == id);

    if (id < 0) {
      throw new Error('id has to be a number');
      return 2;
    }

    if (userFound) {
      users.splice(userFound, 1);
      return 0;
    } else {
      //throw new Error(`User with id=${id} not found`);
      return 1;
    }
  }
};
  
module.exports = userService;