require('dotenv').config();
const { error } = require('../helpers/responseApi');

let ADMIN_PERMISSION = process.env['ROLE.ADMIN'];

exports.testMinimumPrivilige = (requiredPermissionLevel) => (req, res, next) => {
  const userPermissionLevel = parseInt(req.jwt.role, 10);
  if (userPermissionLevel >= requiredPermissionLevel) {
    return next();
  }
  return next(error('Forbidden', 403));
};

exports.onlyForUserOrAdmin = (req, res, next) => {
  const userPermissionLevel = parseInt(req.jwt.role, 10);
  const { userId } = req.jwt;
  if (req.params && req.params.userId && userId === req.params.userId) {
    return next();
  }
  ADMIN_PERMISSION = parseInt(ADMIN_PERMISSION, 10);
  if (userPermissionLevel === ADMIN_PERMISSION) {
    return next();
  }
  return next(error('Forbidden', 403));
};
