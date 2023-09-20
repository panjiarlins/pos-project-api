const { ResponseError } = require('../errors');
const {
  Sequelize,
  sequelize,
  Transaction,
  Variant,
  TransactionVariant,
} = require('../models');
const sendResponse = require('../utils/sendResponse');

const transactionController = {
  getAllTransactions: async (req, res) => {
    try {
      const transactions = await Transaction.findAll({
        include: [
          {
            // model: TransactionVariant,
            model: Variant,
          },
        ],
      });

      sendResponse({ res, statusCode: 200, data: transactions });
    } catch (error) {
      sendResponse({ res, error });
    }
  },

  createTransaction: async (req, res) => {
    try {
      await sequelize.transaction(
        {
          isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE,
        },
        async (t) => {
          const { userId, variants, voucherCode } = req.body;
          const variantsId = variants.map(({ variantId }) => variantId);
          const quantities = variants.map(({ quantity }) => quantity);
          const arrTotal = [];
          const arrTotalWithoutDiscount = [];
          let isVoucherValid = !voucherCode;

          // get all variants data
          const variantsData = await Variant.findAll({
            where: { id: variantsId },
            transaction: t,
          });
          if (variantsData.length !== variantsId.length)
            throw new ResponseError('invalid variantId', 400);

          // loop all variants data
          // eslint-disable-next-line no-restricted-syntax
          for (let i = 0; i < variantsData.length; i += 1) {
            // descrease variant stock
            if (variantsData[i].stock < quantities[i])
              throw new ResponseError(
                `out of stock for variantId:${variantsData[i].id}`,
                400
              );
            // eslint-disable-next-line no-await-in-loop
            await variantsData[i].increment(
              { stock: -quantities[i] },
              { transaction: t }
            );

            // get voucher data
            if (voucherCode) {
              // get product data
              // eslint-disable-next-line no-await-in-loop
              const productData = await variantsData[i].getProduct({
                transaction: t,
              });
              if (!productData)
                throw new ResponseError('invalid product data', 400);

              // get voucherData
              // eslint-disable-next-line no-await-in-loop
              const [voucherData] = await productData.getVouchers({
                where: { code: voucherCode },
                transaction: t,
              });
              if (voucherData) isVoucherValid = true;

              // push total
              arrTotal.push(
                voucherData
                  ? variantsData[i].price *
                      quantities[i] *
                      (1 - voucherData.discount)
                  : variantsData[i].price * quantities[i]
              );
            }

            // push total
            if (!voucherCode)
              arrTotal.push(variantsData[i].price * quantities[i]);

            // push total without discount
            arrTotalWithoutDiscount.push(variantsData[i].price * quantities[i]);
          }

          if (!isVoucherValid)
            throw new ResponseError('invalid voucher code', 400);

          // create new transaction
          // eslint-disable-next-line no-await-in-loop
          const transactionData = await Transaction.create(
            {
              userId,
              voucherCode,
              total: arrTotal.reduce((acc, curr) => acc + curr, 0),
              totalWithoutDiscount: arrTotalWithoutDiscount.reduce(
                (acc, curr) => acc + curr,
                0
              ),
            },
            { transaction: t }
          );

          // create new TransactionVariant
          for (let i = 0; i < arrTotal.length; i += 1) {
            // eslint-disable-next-line no-await-in-loop
            await TransactionVariant.create(
              {
                transactionId: transactionData.id,
                variantId: variantsId[i],
                quantity: quantities[i],
                total: arrTotal[i],
                totalWithoutDiscount: arrTotalWithoutDiscount[i],
              },
              { transaction: t }
            );
          }

          sendResponse({ res, statusCode: 201, data: transactionData });
        }
      );
    } catch (error) {
      sendResponse({ res, error });
    }
  },
};

module.exports = transactionController;
