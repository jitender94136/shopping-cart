const {
  getById, insert, insertSeller, list, patchById,
} = require('../controllers/users/user');
const { onlyForUserOrAdmin, testMinimumPrivilige } = require('../middlewares/permissionValidator');
const { verifyAccessToken } = require('../helpers/jwt_helper');
const { hasValidFields } = require('../middlewares/authValidator');
require('dotenv').config();

const ADMIN = process.env['ROLE.ADMIN'];

exports.routes = function (app) {
  // registers a user
  app.post('/users', [hasValidFields, insert]);

  // registers a seller (only logged in user can become a seller)
  app.post('/sellers/:userId', [verifyAccessToken, insertSeller]);

  // list all users
  app.get('/users', [verifyAccessToken, testMinimumPrivilige(ADMIN), list]);

  // get user data by user id
  app.get('/users/:userId', [verifyAccessToken, onlyForUserOrAdmin, getById]);

  // partial data update
  app.patch('/users/:userId', [verifyAccessToken, onlyForUserOrAdmin, patchById]);
};
