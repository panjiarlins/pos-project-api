const Joi = require('joi');
const { ResponseError } = require('../../errors');

const userValidator = {
  registerUser: (req, res, next) => {
    try {
      const schema = Joi.object({
        username: Joi.string().required(),
        fullname: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        isAdmin: Joi.boolean().required(),
        isCashier: Joi.boolean().required(),
        isActive: Joi.boolean().required(),
      });
      const result = schema.validate(req.body);
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
  editUserByIdWithParams: (req, res, next) => {
    try {
      const schema = Joi.object({
        id: Joi.number().min(1).required(),
      });
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
  editUserById: (req, res, next) => {
    try {
      const schema = Joi.object({
        username: Joi.string().required(),
        fullname: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        isAdmin: Joi.boolean().required(),
        isCashier: Joi.boolean().required(),
        isActive: Joi.boolean().required(),
      });
      const result = schema.validate(req.body);
      console.log(result, 'validataor user');
      if (result.error)
        throw new ResponseError(result.error?.message || result.error, 400);

      next();
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        status: 'errortes',
        message: error?.message || error,
      });
    }
  },
  deleteUserByIdWithParams: (req, res, next) => {
    try {
      const schema = Joi.object({
        id: Joi.number().min(1).required(),
      });
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
module.exports = userValidator;
