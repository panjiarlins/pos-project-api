const router = require('express').Router();
const transactionVariantController = require('../controllers/transVariants');

router.get('/', transactionVariantController.getAllTransactionVariants);
module.exports = router;
