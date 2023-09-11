/* eslint-disable no-unused-vars */
const Joi = require('joi');
const { ResponseError } = require('../../errors');

const productValidator = {
  getProducts: (req, res, next) => {},

  createProduct: (req, res, next) => {},

  editProductById: (req, res, next) => {},

  deleteProductById: (req, res, next) => {
    try {
      const schema = Joi.object({
        id: Joi.number().min(1).required(),
      }).required();

      const result = schema.validate(req.params);
      if (result.error)
        throw new ResponseError(result.error?.message || result.error, 400);

      next();
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        status: 'error',
        message: error?.message || error,
      });
    }
  },
};

module.exports = productValidator;
