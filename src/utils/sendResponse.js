function sendResponse({ res, error, statusCode, data, ...info }) {
  const code = error
    ? statusCode || error?.statusCode || 500
    : statusCode || 200;
  const message = error ? error?.message || error : undefined;
  const status = code >= 200 && code < 300 ? 'success' : 'error';

  res.status(code).json({
    status,
    data,
    message,
    info: Object.keys(info).length ? info : undefined,
  });
}

module.exports = sendResponse;
