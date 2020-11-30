const ProductController = require('../../controllers/products/product.controller');
const PermissionMiddleware = require('../../middlewares/permission/auth.permission.middleware');
const ValidationMiddleware = require('../../middlewares/validation/auth.validation.middleware');
const configData = require('../../shared/config');

const ADMIN = configData.role.ADMIN;
const SELLER = configData.role.SELLER;

exports.routes = function (app) {

    //only seller or admin can add a product
    app.post('/products', [
        ValidationMiddleware.isValidJWT,
        PermissionMiddleware.testMinimumPrivilige(SELLER),
        ProductController.insert
    ]);

    // only admin can add a product category
    app.post('/productCategories', [
        ValidationMiddleware.isValidJWT,
        PermissionMiddleware.testMinimumPrivilige(ADMIN),
        ProductController.insertProductCategories
    ]);

    app.get('/products', [
        ProductController.listProducts
    ]);

    app.get('/productCategories', [
        ProductController.listCategories
    ]);

    app.get('/productCategories/:categoryId/products', [
        ProductController.getProductsByCategoryId
    ]);

    // TODO: only the seller that created the product can update the product (pending)
    app.patch('/products/:productId', [
        ValidationMiddleware.isValidJWT,
        PermissionMiddleware.testMinimumPrivilige(SELLER),
        ProductController.patchProductById
    ]);

    app.patch('/productCategories/:categoryId', [
        ValidationMiddleware.isValidJWT,
        PermissionMiddleware.testMinimumPrivilige(ADMIN),
        ProductController.patchProductCategoryById
    ]);

    // TODO: only the seller that created the product can delete the product resource (pending)
    app.delete('/products/:productId', [
        ValidationMiddleware.isValidJWT,
        PermissionMiddleware.testMinimumPrivilige(SELLER),
        ProductController.removeById
    ]);
};
