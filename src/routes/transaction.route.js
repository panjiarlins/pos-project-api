const router = require('express').Router();
const transactionController = require('../controllers/transaction.controller');

router.post('/', transactionController.createTransaction);
module.exports = router;
