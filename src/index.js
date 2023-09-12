require('dotenv').config();
const cors = require('cors');
const express = require('express');
const bearerToken = require('express-bearer-token');
const { productRouter, userRouter } = require('./routes');
// eslint-disable-next-line no-unused-vars
const db = require('./models');

const PORT = process.env.PORT || 2500;

const app = express();
app.use(cors());
app.use(express.json());
app.use(bearerToken());
app.use('/products', productRouter);
app.use('/users', userRouter);

app.listen(PORT, () => {
  console.log(`listen on port:${PORT}`);
  // db.sequelize.sync({ alter: true });
});
