const Joi = require('joi');
const sendResponse = require('../../utils/sendResponse');
const { ResponseError } = require('../../errors');

const transactionValidator = {
  createTransaction: (req, res, next) => {
    try {
      const schema = Joi.object({
        userId: Joi.number().integer().min(1).required(),
        voucherCode: Joi.string(),
        variants: Joi.array()
          .items(
            Joi.object({
              variantId: Joi.number().integer().min(1).required(),
              quantity: Joi.number().integer().min(1).required(),
            }).required()
          )
          .required(),
      }).required();
      const result = schema.validate(req.body);
      if (result.error) throw new ResponseError(result.error?.message, 400);

      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },
};

module.exports = transactionValidator;
