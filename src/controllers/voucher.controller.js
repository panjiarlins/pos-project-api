const sendResponse = require('../utils/sendResponse');
const { ResponseError } = require('../errors');
const { Sequelize, sequelize, Voucher, Product } = require('../models');

const voucherController = {
  createVoucher: async (req, res) => {
    try {
      await sequelize.transaction(
        {
          isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
        },
        async (t) => {
          // check and create new voucher
          const [voucherData, isCreated] = await Voucher.findOrCreate({
            where: { code: req.body.code },
            defaults: req.body,
            fields: ['code', 'name', 'discount'],
            transaction: t,
          });
          if (!isCreated)
            throw new ResponseError('voucher code already exist', 400);

          // set product for new voucher
          if (req.body?.productId && req.body.productId.length > 0) {
            // get unique productId
            req.body.productId = [...new Set(req.body.productId)];

            // check if productId exist
            const productsData = await Product.findAll({
              attributes: ['id'],
              where: { id: req.body.productId },
              transaction: t,
            });
            if (productsData?.length !== req.body.productId.length)
              throw new ResponseError('invalid productId', 400);

            // set voucher to products
            await voucherData.setProducts(req.body.productId, {
              transaction: t,
            });
          }

          // get new voucher
          const result = await Voucher.findByPk(voucherData.code, {
            include: [{ model: Product, attributes: { exclude: ['image'] } }],
            transaction: t,
          });

          sendResponse({ res, statusCode: 201, data: result });
        }
      );
    } catch (error) {
      sendResponse({ res, error });
    }
  },
};

module.exports = voucherController;
