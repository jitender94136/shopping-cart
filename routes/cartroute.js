const {
  getCartByUserId, insertProduct, list, removeProduct, updateProduct,
} = require('../controllers/cart/cart');
require('../middlewares/permissionValidator');
const { verifyAccessToken } = require('../helpers/jwt_helper');
require('dotenv').config();

exports.routes = function (app) {
  app.get('/cart/:userId', [
    verifyAccessToken,
    getCartByUserId,
  ]);

  app.post('/cart/:cartId/products', [
    verifyAccessToken,
    insertProduct,
  ]);

  app.get('/cart/:cartId/products', [
    list,
  ]);

  app.patch('/cart/:cartId/products/:productId', [
    updateProduct,
  ]);

  app.delete('/cart/:cartId/products/:productId', [
    removeProduct,
  ]);
};
