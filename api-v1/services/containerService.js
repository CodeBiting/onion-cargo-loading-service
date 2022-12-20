let containers = [
  {
    id: 1,
    code: 'C1',
    description: 'Container 1',
    width: 1,
    length: 1,
    height: 1,
    maxWeight: 1,
  },
  {
    id: 2,
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
    // Comparem amb == ja que l'id que rebem és un string
    return containers.find(o => o.id == id);
  },
  getContainers() {
    return containers;
  }
};

module.exports = containerService;