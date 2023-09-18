const Joi = require('joi');
const sendResponse = require('../../utils/sendResponse');
const { ResponseError } = require('../../errors');

const voucherValidator = {
  createVoucher: (req, res, next) => {
    try {
      const schema = Joi.object({
        code: Joi.string().required(),
        name: Joi.string().required(),
        discount: Joi.number().min(0).max(1).required(),
        productId: Joi.array().items(Joi.number().integer().min(1)),
      }).required();
      const result = schema.validate(req.body);
      if (result.error) throw new ResponseError(result.error?.message, 400);

      next();
    } catch (error) {
      sendResponse({ res, error });
    }
  },
};

module.exports = voucherValidator;
