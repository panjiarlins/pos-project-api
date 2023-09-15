const userRouter = require('./user.route');
const categoryRouter = require('./category.route');
const productRouter = require('./product.route');

const transactionRouter = require('./transaction.route');

module.exports = {
  userRouter,
  categoryRouter,
  productRouter,
  transactionRouter,
};
const voucherRouter = require('./voucher.route');
module.exports = { userRouter, categoryRouter, productRouter, voucherRouter };

