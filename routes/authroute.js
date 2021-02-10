const { hasValidFields, isPasswordAndUserMatch } = require('../middlewares/authValidator');
const { login, refreshToken } = require('../controllers/auth/authentication');

// eslint-disable-next-line func-names
exports.routes = function (app) {
  app.post('/login', hasValidFields, isPasswordAndUserMatch, login);
  app.post('/refresh-token', refreshToken);
};
