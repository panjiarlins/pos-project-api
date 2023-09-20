const userRouter = require('./user.route');
const categoryRouter = require('./category.route');
const productRouter = require('./product.route');
const transactionRouter = require('./transaction.route');
const voucherRouter = require('./voucher.route');
const variantController = require('./variant.route');
const transactionVariantController = require('./transVariants');

module.exports = {
  userRouter,
  categoryRouter,
  productRouter,
  voucherRouter,
  transactionRouter,
  variantController,
  transactionVariantController,
};
