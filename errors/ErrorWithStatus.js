class ErrorWithStatus extends Error {
  constructor(errCode, mssg) {
    super(mssg);
    this.statusCode = errCode;
  }
}

module.exports = ErrorWithStatus;
