let registers = [
    {
      id: 1,
      date: '22-03-2020T15:30:04',
      origin: '127.04.71:8078',
      destiny: 'http://v1/container',
      method: 'POST',
      status: 200,
      requestBody: 'Body initial',
      responseData: 'Body final',
    
    },
    {
      id: 2,
      date: '12-06-2022T17:04:30',
      origin: '124.04.73:8670',
      destiny: 'http://v1/container',
      method: 'GET',
      status: 404,
      requestBody: 'Body initial',
      responseData: 'Body final',
    }
  ];
  
  const registerService = {

    getRegister(id) {
      if(id == ""){
        return undefined;
      }else{
        return registers.find(o => o.id == id);
      }
    },

    getRegisters() {
      return registers;
    },
    
    postRegister(register){
      register.date = register.date || new Date();
      const nextId = registers.reduce((maxId, register) => Math.max(maxId, register.id), 0) + 1;
      registers.push({ ...register, id: nextId });
      return registers[registers.length-1];
  
    },
  
    putRegister(id, newRegisterData) {
      const registerToUpdate = registers.find(register => register.id == id);
      if (registerToUpdate) {
        registerToUpdate.date = newRegisterData.date || registerToUpdate.date;
        registerToUpdate.origin = newRegisterData.origin || registerToUpdate.origin;
        registerToUpdate.destiny = newRegisterData.destiny || registerToUpdate.destiny;
        registerToUpdate.method = newRegisterData.method || registerToUpdate.method;
        registerToUpdate.status = newRegisterData.status || registerToUpdate.status;
        registerToUpdate.requestBody = newRegisterData.requestBody || registerToUpdate.requestBody; 
        registerToUpdate.responseData = newRegisterData.responseData || registerToUpdate.responseData;
      }
      return registerToUpdate;
    },
  
    deleteRegister(id) {
      const index = registers.findIndex(o => o.id == id); 
      if (index >= 0) {
        let registerDeleted = registers.splice(index, 1); 
        return registerDeleted[0];
      } else {
        return undefined; 
      }
    }
  
  };
  
  module.exports = registerService;