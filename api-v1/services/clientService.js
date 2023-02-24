let clients = [
  {
    id: 1,
    code: "jordi",
    dateStart: new Date(2023, 0, 1),
    dateFinal: new Date(2023, 0, 2),
    active: true,
    token: "fer el seu fitxer",
    notes: "no se, notes",
  }
];

const clientService = {
  getContainer(id) {
    // Comparem amb == ja que l'id que rebem és un string
    return clients.find(o => o.id == id);
  },

  getContainers() {
    return clients;
  },

  postclient(client) {
    let maxId = 0;
    for (let i = 0; i < clients.length; i++) {
      if (clients[i].id > maxId) {
        maxId = clients[i].id;
      }
    }
    maxId++;
    client.id = maxId;
    clients.push(client);
    
    if (id < 0) {
      //throw new Error('id has to be a number');
      return 2;
    }
    let clientFound = clients.find(o => o.id == id);
    if (clientFound) {
      clients.splice(clientFound, 1);

      return 0;
    } else {
      //throw new Error(`Container with id=${id} not found`);
      return 1;
    }
  },

  putGestor(id, client) {
    if (isNaN(id)) {
      return 1;
    }
    if (id < 0) {
      return 2;
    }
    let clientFound = clients.find(o => o.id == id);
    if (!clientFound) {
      return 3;
    }
    clientFound.code = client.code;
    clientFound.dateStart = client.dateStart;
    clientFound.dateFinal = client.dateFinal;
    clientFound.active = client.active;
    clientFound.token = client.token;
    clientFound.notes = client.notes;
    return 0;
  },

  deleteGestor(id) {
    if (isNaN(id)) {
      return 1;
    }
    if (id < 0) {
      return 2;
    }
    let clientFound = clients.find(o => o.id == id);
    if (!clientFound) {
      return 3;
    }
    return 0;
  }
};

module.exports = clientService;