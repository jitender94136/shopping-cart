const { list, placeOrder } = require('../controllers/order/order');
const { onlyForUserOrAdmin } = require('../middlewares/permissionValidator');
const { verifyAccessToken } = require('../helpers/jwt_helper');

exports.routes = function (app) {
  app.post('/orders/:userId', [
    verifyAccessToken,
    onlyForUserOrAdmin,
    placeOrder,
  ]);

  app.get('/orders/:orderId', [
    verifyAccessToken,
    list,
  ]);
};
