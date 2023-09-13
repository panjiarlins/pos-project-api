const router = require('express').Router();
const { voucherValidator } = require('../middlewares/validators');
const { voucherAuth } = require('../middlewares/auth');
const { voucherController } = require('../controllers');

router.post(
  '/',
  voucherValidator.createVoucher,
  voucherAuth.createVoucher,
  voucherController.createVoucher
);

module.exports = router;
