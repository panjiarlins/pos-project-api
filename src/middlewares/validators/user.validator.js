const Joi = require('joi');
const { ResponseError } = require('../../errors');
const sendResponse = require('../../utils/sendResponse');

const userValidator = {
  getUserById: (req, res, next) => {
    try {
      const schema = Joi.object({
        id: Joi.number().min(1).required(),
      }).required();
      const result = schema.validate(req.params);
      if (result.error) throw new ResponseError(result.error?.message, 400);

      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  getUserImageById: (req, res, next) => {
    try {
      const schema = Joi.object({
        id: Joi.number().integer().min(1).required(),
      }).required();

      const result = schema.validate(req.params);

      if (result.error) throw new ResponseError(result.error?.message, 400);

      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  registerUser: (req, res, next) => {
    try {
      // validate req.body
      const schemaBody = Joi.object({
        username: Joi.string().required(),
        fullname: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        isAdmin: Joi.boolean().required(),
        isCashier: Joi.boolean().required(),
        isActive: Joi.boolean().required(),
      }).required();
      const resultBody = schemaBody.validate(req.body);
      if (resultBody.error)
        throw new ResponseError(resultBody.error?.message, 400);

      // validate req.file
      const schemaFile = Joi.required().label('image');
      const resultFile = schemaFile.validate(req.file);
      if (resultFile.error)
        throw new ResponseError(resultFile.error?.message, 400);

      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  loginUser: (req, res, next) => {
    try {
      const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().min(8).required(),
      }).required();
      const result = schema.validate(req.body);
      if (result.error) throw new ResponseError(result.error?.message, 400);

      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  editUserById: (req, res, next) => {
    try {
      // validate req.params
      const schemaParams = Joi.object({
        id: Joi.number().min(1).required(),
      }).required();
      const resultParams = schemaParams.validate(req.params);
      if (resultParams.error)
        throw new ResponseError(resultParams.error?.message, 400);

      // validate req.body
      const schemaBody = Joi.object({
        username: Joi.string(),
        fullname: Joi.string(),
        email: Joi.string().email(),
        password: Joi.string().min(8),
        isAdmin: Joi.boolean(),
        isCashier: Joi.boolean(),
        isActive: Joi.boolean(),
      }).required();
      const resultBody = schemaBody.validate(req.body);
      if (resultBody.error)
        throw new ResponseError(resultBody.error?.message, 400);

      // validate req.file
      const schemaFile = Joi.optional().label('image');
      const resultFile = schemaFile.validate(req.file);
      if (resultFile.error)
        throw new ResponseError(resultFile.error?.message, 400);

      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  deleteUserById: (req, res, next) => {
    try {
      const schema = Joi.object({
        id: Joi.number().min(1).required(),
      });
      const result = schema.validate(req.params);
      if (result.error) throw new ResponseError(result.error?.message, 400);

      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },
};

module.exports = userValidator;
