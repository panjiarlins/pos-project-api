const jwt = require('jsonwebtoken');
const { ResponseError } = require('../../errors');
const { User } = require('../../models');
const sendResponse = require('../../utils/sendResponse');

function verifyUserAuth({ isAdmin = false, isCashier = false }) {
  return (req, res, next) => {
    try {
      jwt.verify(req.token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) throw new ResponseError(err, 401);

        User.findByPk(decoded.id, {
          attributes: ['isAdmin', 'isCashier'],
        })
          .then((userData) => {
            if (isAdmin && userData.isAdmin) return;
            if (isCashier && userData.isCashier) return;
            throw new ResponseError('user unauthorized', 401);
          })
          .catch((error) => {
            throw error;
          });
      });

      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  };
}

module.exports = verifyUserAuth;
