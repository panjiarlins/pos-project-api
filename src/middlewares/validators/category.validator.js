const Joi = require('joi');
const { ResponseError } = require('../../errors');
const sendResponse = require('../../utils/sendResponse');

const categoryValidator = {
  getCategoryImageById: (req, res, next) => {
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

  createCategory: (req, res, next) => {
    try {
      // validate req.body
      const schemaBody = Joi.object({
        name: Joi.string().required(),
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

  editCategoryById: (req, res, next) => {
    try {
      // validate req.params
      const schemaParams = Joi.object({
        id: Joi.number().min(1).required(),
      }).required();
      const resultParams = schemaParams.validate(req.params);
      if (resultParams.error)
        throw new ResponseError(resultParams.error?.message, 400);

      // validate req.body
      const schemaBody = Joi.object({ name: Joi.string() }).required();
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

  deleteCategoryById: (req, res, next) => {
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
};

module.exports = categoryValidator;
