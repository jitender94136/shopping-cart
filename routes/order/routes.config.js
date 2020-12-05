const OrderController = require('../../controllers/order/order.controller');
const PermissionMiddleware = require('../../middlewares/permission/auth.permission.middleware');
const ValidationMiddleware = require('../../middlewares/validation/auth.validation.middleware');

exports.routes = function (app) {

    app.post('/orders/:userId', [
        ValidationMiddleware.isValidJWT,
        PermissionMiddleware.onlyForUserOrAdmin,
        OrderController.placeOrder
    ]);

    app.get('/orders/:orderId', [
        ValidationMiddleware.isValidJWT,
        OrderController.list
    ]);
};
