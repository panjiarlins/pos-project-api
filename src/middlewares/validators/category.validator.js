const Joi = require('joi');
const { ResponseError } = require('../../errors');

const categoryValidator = {
  createCategory: (req, res, next) => {
    try {
      // validate req.body
      const schemaBody = Joi.object({
        name: Joi.string().required(),
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

  editCategoryById: (req, res, next) => {
    next();
  },

  deleteCategoryById: (req, res, next) => {
    next();
  },
};

module.exports = categoryValidator;
