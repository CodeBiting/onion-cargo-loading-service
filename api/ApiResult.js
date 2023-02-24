class ApiResult {
    /**
     * 
     * @param {*} status 
     * @param {*} data 
     * @param {*} error : object from class ApiError
     */
    constructor(status, data, errors) {
      this.status = status;
      this.data = data;
      this.errors = [];

      if (errors && Array.isArray(errors) ) {
        for (let i = 0; i < errors.length; i++) {
          this.errors.push(new ApiError(errors[i].code, errors[i].message, errors[i].detail, errors[i].help));  
        }           
      }     
    }
  }

  class ApiError {
    constructor(code, message, detail, help) {
      this.code = code;
      this.message = (message ? message : '');
      this.detail = (detail ? detail : '' );
      this.help = (help ? help : '');
    }
  }

  module.exports = ApiResult;