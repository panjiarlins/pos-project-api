const { MulterError } = require('multer');
const sendResponse = require('../../utils/sendResponse');

const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof MulterError) {
    sendResponse({ res, statusCode: 400, error: err });
    return;
  }

  if (err) {
    sendResponse({ res, error: err });
    return;
  }

  next();
};

module.exports = multerErrorHandler;
