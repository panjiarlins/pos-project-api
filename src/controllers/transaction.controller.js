const { ResponseError } = require('../errors');
const {
  Transaction,
  Variant,
  TransactionVariant,
  Voucher,
  sequelize,
} = require('../models');
// const voucher = require('../models/voucher');

// const Voucher = require('../models/voucher');
// const db = require('../models');

const transactionController = {
  createTransaction: async (req, res) => {
    try {
      await sequelize.transaction(async (t) => {
        const { voucherCode, userId, variants } = req.body;

        const variantIds = variants.map(({ variantId }) => variantId);
        const quantities = variants.map(({ quantity }) => quantity);

        const variantsData = await Variant.findAll({
          where: { id: variantIds },
          transaction: t,
        });
        let totalAmount = 0;
        let i = 0;
        const prices = [];
        while (i < variantIds.length) {
          const quantity = quantities[i];
          prices.push(variantsData[i].price);

          if (variantsData[i].stock < quantity)
            throw new ResponseError('stock not enough', 400);
          const itemPrice = variantsData[i].price * quantity;
          totalAmount += itemPrice;

          // eslint-disable-next-line no-await-in-loop
          await variantsData[i].increment(
            { stock: -quantity },
            { transaction: t }
          );
          i += 1;
        }

        const voucherData = await Voucher.findByPk(voucherCode, {
          transaction: t,
        });
        totalAmount *= 1 - voucherData.discount;
        const transaction = await Transaction.create(
          {
            userId,
            total: totalAmount,
            voucherCode,
          },
          { transaction: t }
        );

        variantIds.forEach(
          async (variantId, index) => {
            await TransactionVariant.create({
              transactionId: transaction.id,
              variantId,
              quantity: quantities[index],
              price: prices[index],
            });
          },
          { transaction: t }
        );

        res.status(200).json({
          status: 'success',
          message: 'Transaksi berhasil dibuat',
          data: transaction,
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

module.exports = transactionController;
