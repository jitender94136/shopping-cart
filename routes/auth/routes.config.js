const AuthenticationMiddleware = require('../../middlewares/auth/authentication.middleware');
const AuthenticationController = require('../../controllers/auth/authentication.controller');
const ValidationMiddleware = require('../../middlewares/validation/auth.validation.middleware');

exports.routesConfig = function (app) {
    app.post('/login', [
        AuthenticationMiddleware.hasAuthValidFields,
        AuthenticationMiddleware.isPasswordAndUserMatch,
        AuthenticationController.login
    ]);

    app.post('/auth/refresh', [
        ValidationMiddleware.isValidJWT,
        ValidationMiddleware.verifyRefreshBodyField,
        ValidationMiddleware.validRefreshNeeded,
        AuthenticationController.login
    ]);

    app.post('/logout', [
        AuthenticationController.logout
    ]);
};