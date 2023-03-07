class ApiError {
  constructor(code, message, detail, help) {
    this.code = code;
    this.message = (message ? message : '');
    this.detail = (detail ? detail : '' );
    this.help = (help ? help : '');
  }
}

module.exports = ApiError;