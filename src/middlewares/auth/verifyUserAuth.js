const jwt = require('jsonwebtoken');
const { ResponseError } = require('../../errors');
const { User } = require('../../models');
const sendResponse = require('../../utils/sendResponse');

function verifyUserAuth({ isAdmin = false, isCashier = false } = {}) {
  return async (req, res, next) => {
    try {
      await jwt.verify(
        req.token,
        process.env.JWT_SECRET_KEY,
        async (err, decoded) => {
          if (err) throw new ResponseError(err, 401);

          const userData = await User.findByPk(decoded.id, {
            attributes: ['isAdmin', 'isCashier'],
          });

          if (!userData) throw new ResponseError('user unauthorized', 401);
          if (isAdmin && userData.isAdmin) return;
          if (isCashier && userData.isCashier) return;
          throw new ResponseError('user unauthorized', 401);
        }
      );

      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  };
}

module.exports = verifyUserAuth;
