// const jwt = require('jsonwebtoken');
// const { ResponseError } = require('../../errors');

const jwt = require('jsonwebtoken');
const { ResponseError } = require('../../errors');
const sendResponse = require('../../utils/sendResponse');
const { User } = require('../../models');

const productAuth = {
  getProducts: (req, res, next) => {
    try {
      jwt.verify(req.token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) throw new ResponseError(err, 401);

        User.findByPk(decoded.id, {
          attributes: ['isAdmin', 'isCashier'],
        })
          .then((userData) => {
            if (!userData || !userData.isAdmin || !userData.isCashier)
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
  },

  createProduct: async (req, res, next) => {
    next();
  },

  editProductById: async (req, res, next) => {
    next();
  },

  deleteProductById: async (req, res, next) => {
    next();
  },
};

module.exports = productAuth;
