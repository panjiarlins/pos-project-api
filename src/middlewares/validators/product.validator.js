const Joi = require('joi');
const { ResponseError } = require('../../errors');
const sendResponse = require('../../utils/sendResponse');

const productValidator = {
  getProducts: (req, res, next) => {
    try {
      const schema = Joi.object({
        name: Joi.string().allow(''),
        categoryId: Joi.number().integer().min(1).allow(''),
        sortBy: Joi.string().allow(''),
        orderBy: Joi.string().valid('ASC', 'asc', 'DESC', 'desc').allow(''),
      });

      const result = schema.validate(req.query);

      if (result.error) throw new ResponseError(result.error?.message, 400);

      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  getProductImageById: (req, res, next) => {
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

  createProduct: (req, res, next) => {
    try {
      // convert categoryId : string -> array -> set -> array
      req.body.categoryId = [...new Set(JSON.parse(req.body.categoryId))];

      // convert variants : string -> array
      req.body.variants = JSON.parse(req.body.variants);

      // convert isActive : string -> boolean
      req.body.isActive = JSON.parse(req.body.isActive);

      // validate req.body
      const schemaBody = Joi.object({
        name: Joi.string().required(),
        categoryId: Joi.array().items(Joi.number().integer().min(1)),
        description: Joi.string().required(),
        isActive: Joi.boolean(),
        variants: Joi.array().items(
          Joi.object({
            name: Joi.string().required(),
            price: Joi.number().integer().min(1).required(),
            stock: Joi.number().integer().min(0).required(),
          })
        ),
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

  editProductById: (req, res, next) => {
    try {
      // convert categoryId : string -> array -> set -> array
      if (req.body?.categoryId)
        req.body.categoryId = [...new Set(JSON.parse(req.body.categoryId))];

      // convert variants : string -> array
      if (req.body?.variants) req.body.variants = JSON.parse(req.body.variants);

      // convert isActive : string -> boolean
      if (req.body?.isActive) req.body.isActive = JSON.parse(req.body.isActive);

      // validate req.body
      const schemaBody = Joi.object({
        name: Joi.string(),
        categoryId: Joi.array().items(Joi.number().integer().min(1)),
        description: Joi.string(),
        isActive: Joi.boolean(),
        variants: Joi.array().items(
          Joi.object({
            id: Joi.number().integer().min(1),
            name: Joi.string(),
            price: Joi.number().integer().min(1),
            stock: Joi.number().integer().min(0),
          })
        ),
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

  deleteProductById: (req, res, next) => {
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

module.exports = productValidator;
