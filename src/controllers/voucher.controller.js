const { ResponseError } = require('../errors');
const { sequelize, Voucher, Product } = require('../models');

const voucherController = {
  createVoucher: async (req, res) => {
    try {
      await sequelize.transaction(async (t) => {
        // get unique productId
        req.body.productId = [...new Set(req.body.productId)];

        const { code, name, discount, productId } = req.body;

        // check and create new voucher
        const [voucherData, isCreated] = await Voucher.findOrCreate({
          where: { code: req.body.code },
          defaults: { code, name, discount },
          transaction: t,
        });
        if (!isCreated)
          throw new ResponseError('voucher code already exist', 400);

        // check if productId exist
        const productsData = await Product.findAll({
          attributes: ['id'],
          where: { id: productId },
          transaction: t,
        });
        if (productsData?.length !== productId.length)
          throw new ResponseError('invalid productId', 400);

        // set voucher to products
        await voucherData.setProducts(productId, { transaction: t });

        // get new voucher
        const result = await Voucher.findByPk(voucherData.code, {
          include: [{ model: Product, attributes: { exclude: ['image'] } }],
          transaction: t,
        });

        res.status(201).json({
          status: 'success',
          data: result,
        });
      });
    } catch (error) {
      res.status(error?.statusCode || 500).json({
        status: 'error',
        message: error?.message || error,
      });
    }
  },
};

module.exports = voucherController;
