const router = require('express').Router();
const verifyUserAuth = require('../middlewares/auth/verifyUserAuth');
const transactionValidator = require('../middlewares/validators/transaction.validator');
const transactionController = require('../controllers/transaction.controller');

router.get('/', transactionController.getAllTransactions);
// POST new transaction
router.post(
  '/',
  verifyUserAuth({ isAdmin: true }),
  transactionValidator.createTransaction,
  transactionController.createTransaction
);
module.exports = router;
