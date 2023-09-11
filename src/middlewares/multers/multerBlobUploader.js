const multer = require('multer');
const { ResponseError } = require('../../errors');

const multerBlobUploader = () =>
  multer({
    fileFilter: (req, file, cb) => {
      if (file.mimetype.split('/')[0] !== 'image') {
        return cb(new ResponseError('image file invalid', 400));
      }
      return cb(null, true);
    },
    limits: {
      fileSize: 1000000,
    },
  });

module.exports = multerBlobUploader;
