let clients = [
  {
    id: 1,
    code: "jordi",
    dateStart: "01/01/2023",
    dateFinal: "02/01/2023",
    active: true,
    token: "fer el seu fitxer",
    notes: "no se, notes",
  }
];

const clientService = {
  getClient(id) {
    if (id == "") {
      return undefined;
    } else {
    // Comparem amb == ja que l'id que rebem és un string
    return clients.find(o => o.id == id);
    }
  },

  getClients() {
    return clients;
  },

  postClient(client) {
    const nextId = clients.reduce((maxId, client) => Math.max(maxId, client.id), 0) + 1;
    clients.push({ ...client, id: nextId });
    return clients[clients.length-1];
  
  },

  putClient(id, client) {
    const clientToUpdate = clients.find(client => client.id == id);
    if (clientToUpdate) {
      clientToUpdate.code = client.code || clientToUpdate.code;
      clientToUpdate.dateStart = client.dateStart || clientToUpdate.dateStart;
      clientToUpdate.dateFinal = client.dateFinal || clientToUpdate.dateFinal;
      clientToUpdate.active = client.active || clientToUpdate.active;
      clientToUpdate.token = client.token || clientToUpdate.token;
      clientToUpdate.notes = client.notes || clientToUpdate.notes; 
    }
    return clientToUpdate;
  },

  deleteClient(id) {
    const index = clients.findIndex(o => o.id == id); 
    if (index >= 0) {
      let clientDeleted = clients.splice(index, 1); 
      return clientDeleted[0];
    } else {
      return undefined; 
    }
  }
};

module.exports = clientService;