const SERVER_ERROR = 500;

class ServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = SERVER_ERROR;
  }
}

module.exports = ServerError;
