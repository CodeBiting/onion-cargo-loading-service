let containers = [
  {
    id: 1,
    clientId: 1,
    code: 'C1',
    description: 'Container 1',
    width: 1,
    length: 1,
    height: 1,
    maxWeight: 1,
  },
  {
    id: 2,
    clientId: 2,
    code: 'C2',
    description: 'Container 2',
    width: 2,
    length: 1,
    height: 1,
    maxWeight: 1,
  }
];

const containerService = {

  getContainer(id) {
    if (id == "") {
      return undefined;
    } else {
      // Comparem amb == ja que l'id que rebem és un string
      return containers.find(o => o.id == id);
    }
  },
  
  getContainers() {
    return containers;
  },

  getClientContainers(clientId) {
    return containers.filter(c => c.clientId == clientId);
  },

  postContainer(container){

    const nextId = containers.reduce((maxId, container) => Math.max(maxId, container.id), 0) + 1;
    containers.push({ ...container, id: nextId });
    return containers[containers.length-1];

  },

  putContainer(id, newContainerData) {
    const containerToUpdate = containers.find(container => container.id == id);
    if (containerToUpdate) {
      containerToUpdate.clientId = newContainerData.clientId || containerToUpdate.clientId;
      containerToUpdate.code = newContainerData.code || containerToUpdate.code;
      containerToUpdate.description = newContainerData.description || containerToUpdate.description;
      containerToUpdate.width = newContainerData.width || containerToUpdate.width;
      containerToUpdate.length = newContainerData.length || containerToUpdate.length;
      containerToUpdate.height = newContainerData.height || containerToUpdate.height;
      containerToUpdate.maxWeight = newContainerData.maxWeight || containerToUpdate.maxWeight;
    }
    return containerToUpdate;
  },

  deleteContainer(id) {
    const index = containers.findIndex(o => o.id == id); 
    if (index >= 0) {
      let conatinerDeleted = containers.splice(index, 1); 
      return conatinerDeleted[0];
    } else {
      return undefined; 
    }
  }

};

module.exports = containerService;