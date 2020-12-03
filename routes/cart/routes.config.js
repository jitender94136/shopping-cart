const CartController = require('../../controllers/cart/cart.controller');
const PermissionMiddleware = require('../../middlewares/permission/auth.permission.middleware');
const ValidationMiddleware = require('../../middlewares/validation/auth.validation.middleware');
const configData = require('../../shared/config');

const ADMIN = configData.role.ADMIN;
const SELLER = configData.role.SELLER;

exports.routes = function (app) {

    app.get('/cart/:userId', [
        ValidationMiddleware.isValidJWT,
        CartController.getCartByUserId
    ]);

    app.post('/cart/:cartId/products', [
        ValidationMiddleware.isValidJWT,
        CartController.insertProduct
    ]);

    app.get('/cart/:cartId/products', [
        CartController.list
    ]);

    app.patch('/cart/:cartId/products/:productId', [
        CartController.updateProduct
    ]);

    app.delete('/cart/:cartId/products/:productId', [
        CartController.removeProduct
    ]);
};
