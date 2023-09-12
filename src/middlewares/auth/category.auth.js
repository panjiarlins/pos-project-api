// const jwt = require('jsonwebtoken');
// const { ResponseError } = require('../../errors');

const categoryAuth = {
  createCategory: async (req, res, next) => {
    next();
  },

  editCategoryById: async (req, res, next) => {
    next();
  },

  deleteCategoryById: async (req, res, next) => {
    next();
  },
};

module.exports = categoryAuth;
