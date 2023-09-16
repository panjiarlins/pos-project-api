require('dotenv').config();
const cors = require('cors');
const express = require('express');
const bearerToken = require('express-bearer-token');
const {
  userRouter,
  categoryRouter,
  productRouter,
  transactionRouter,
  voucherRouter,
} = require('./routes');
// eslint-disable-next-line no-unused-vars
const db = require('./models');

const PORT = process.env.PORT || 2500;

const app = express();
app.use(cors());
app.use(express.json());
app.use(bearerToken());
app.use('/users', userRouter);
app.use('/categories', categoryRouter);
app.use('/products', productRouter);
app.use('/transaction', transactionRouter);
app.use('/vouchers', voucherRouter);

app.listen(PORT, () => {
  console.log(`listen on port:${PORT}`);
  // db.sequelize.sync({ alter: true });
});
