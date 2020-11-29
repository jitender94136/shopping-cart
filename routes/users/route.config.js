const UsersController = require('../../controllers/users/user.controller');
const PermissionMiddleware = require('../../middlewares/permission/auth.permission.middleware');
const ValidationMiddleware = require('../../middlewares/validation/auth.validation.middleware');
const AuthenticationMiddleware = require('../../middlewares/auth/authentication.middleware');
const configData = require('../../shared/config');

const CUSTOMER = configData.role.CUSTOMER;
const ADMIN = configData.role.ADMIN;
const SELLER = configData.role.SELLER;

exports.routesConfig = function (app) {
    // registers a user
    app.post('/users', [
        AuthenticationMiddleware.hasValidFields,
        UsersController.insert
    ]);

    // registers a seller (only logged in user can become a seller)
    app.post('/sellers', [
        ValidationMiddleware.isValidJWT,
        UsersController.insertSeller
    ]);

    // list all users
    app.get('/users', [
        ValidationMiddleware.isValidJWT,
        PermissionMiddleware.testMinimumPermissionLevel(ADMIN),
        UsersController.list
    ]);

    // get user data by user id
    app.get('/users/:userId', [
        ValidationMiddleware.isValidJWT,
        PermissionMiddleware.onlyCustomerOrAdminCanDoThisAction,
        UsersController.getById
    ]);

    // partial data update
    app.patch('/users/:userId', [
        ValidationMiddleware.isValidJWT,
        PermissionMiddleware.onlyCustomerOrAdminCanDoThisAction,
        UsersController.patchById
    ]);
};
