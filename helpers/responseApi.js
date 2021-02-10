exports.success = ({ results, message, code }) => ({
  results: results || {},
  message,
  code,
  error: false,
});

class ResponseError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.error = true;
    this.code = statusCode;
    Object.defineProperty(this, 'message', {
      value: message,
      writable: true,
      enumerable: true,
    });
  }
}

exports.error = (message, statusCode) => new ResponseError(message, statusCode);
