class CastError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.name = 'CastError';
  }
}

module.exports = CastError;
