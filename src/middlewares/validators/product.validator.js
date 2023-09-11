const Joi = require('joi');
const { ResponseError } = require('../../errors');

const productValidator = {
  getProducts: (req, res, next) => {
    next();
  },

  createProduct: (req, res, next) => {
    try {
      // convert categoryId : string -> array -> set -> array
      req.body.categoryId = [...new Set(JSON.parse(req.body.categoryId))];

      // convert isActive : string -> boolean
      req.body.isActive = JSON.parse(req.body.isActive);

      // validate req.body
      const schemaBody = Joi.object({
        name: Joi.string().required(),
        categoryId: Joi.array()
          .items(Joi.number().integer().min(1).required())
          .required(),
        description: Joi.string().required(),
        isActive: Joi.boolean().optional(),
      }).required();
      const resultBody = schemaBody.validate(req.body);
      if (resultBody.error)
        throw new ResponseError(
          resultBody.error?.message || resultBody.error,
          400
        );

      // validate req.file
      const schemaFile = Joi.required().label('image');
      const resultFile = schemaFile.validate(req.file);
      if (resultFile.error)
        throw new ResponseError(
          resultFile.error?.message || resultFile.error,
          400
        );

      next();
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        status: 'error',
        message: error?.message || error,
      });
    }
  },

  editProductById: (req, res, next) => {
    next();
  },

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
