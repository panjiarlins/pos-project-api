// const jwt = require('jsonwebtoken');
// const { ResponseError } = require('../../errors');

const productAuth = {
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
