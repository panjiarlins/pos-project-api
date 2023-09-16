const sendResponse = ({ res, statusCode, data, error }) => {
  const code = error ? error?.statusCode || 500 : statusCode;
  const message = error ? error?.message || error : undefined;
  const status = code >= 200 && statusCode < 300 ? 'success' : 'error';

  res.status(code).json({
    status,
    data,
    message,
  });
};

module.exports = sendResponse;
