let gestors = [
  {
    id: 1,
    nom: "empresa",
    token: "integer",
  }
];

const gestorService = {
  getGestor(id) {
    let gestor = gestors.find(o => o.id == id);
    if(!gestor) {
      throw new Error(`Gestor with id=${id} not found`);
    }
    return gestor;
  },

  getGestors() {
    return gestors;
  },

  postGestor(gestor) {
    let maxId = 0;
    for (let i = 0; i < gestors.length; i++) {
      if (gestors[i].id > maxId) {
        maxId = gestors[i].id;
      }
    }
    maxId++;
    gestor.id = maxId;
    gestors.push(gestor);
    
    if (id < 0) {
      //throw new Error('id has to be a number');
      return 2;
    }
    let gestorFound = gestors.find(o => o.id == id);
    if (gestorFound) {
      gestors.splice(gestorFound, 1);

      return 0;
    } else {
      //throw new Error(`Container with id=${id} not found`);
      return 1;
    }
  },

  putGestor(id, gestor) {
    if (isNaN(id)) {
      return 1;
    }
    if (id < 0) {
      return 2;
    }
    let gestorFound = gestors.find(o => o.id == id);
    if (!gestorFound) {
      return 3;
    }
    gestorFound.nom = gestor.nom;
    gestorFound.token = gestor.token;
    return 0;
  },


  deleteGestor(id) {
    if (isNaN(id)) {
      return 1;
    }
    if (id < 0) {
      return 2;
    }
    let gestorFound = gestors.find(o => o.id == id);
    if (!gestorFound) {
      return 3;
    }
    return 0;
  }
};

module.exports = gestorService;