const INCORRECT_DATA = 400;

class IncorrectData extends Error {
  constructor(message) {
    super(message);
    this.statusCode = INCORRECT_DATA;
  }
}

module.exports = IncorrectData;
