const { TransactionVariant } = require('../models');
const sendResponse = require('../utils/sendResponse');

const transactionController = {
  // ... (other controller functions)

  getAllTransactionVariants: async (req, res) => {
    try {
      const transactionVariants = await TransactionVariant.findAll({});

      sendResponse({ res, statusCode: 200, data: transactionVariants });
    } catch (error) {
      sendResponse({ res, error });
    }
  },
};

module.exports = transactionController;
