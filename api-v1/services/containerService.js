let containers = [
  {
    id: 1,
    code: 'C1',
    description: 'Container 1',
    width: 1,
    length: 1,
    height: 1,
    maxWeight: 1,
  }
];

const containerService = {
  getContainers() {
    return containers;
  }
};

module.exports = containerService;