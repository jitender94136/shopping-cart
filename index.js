require('dotenv').config();

const express = require('express');

const app = express();
const morgan = require('morgan');

require('./helpers/init_mongodb');

const port = process.env.PORT;
const bodyParser = require('body-parser');
const AuthRouter = require('./routes/authroute');
const UserRouter = require('./routes/userroute');
const ProductsRouter = require('./routes/productroute');
const CartRouter = require('./routes/cartroute');
const OrderRouter = require('./routes/orderroute');
const { error } = require('./helpers/responseApi');

app.use(bodyParser.json());

app.use(morgan('dev'));

AuthRouter.routes(app);
UserRouter.routes(app);
ProductsRouter.routes(app);
CartRouter.routes(app);
OrderRouter.routes(app);

app.use((req, res, next) => {
  next(error('No route exists', 404));
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.log('index.js', err);
  res.send(err);
});

app.listen(port, () => {
  console.log('app listening at port %s', port);
});

module.exports = app;
