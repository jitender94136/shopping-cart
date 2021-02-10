require('dotenv').config();
const emailValidator = require('email-validator');
const crypto = require('crypto');
const UserModel = require('../models/user');
const { error } = require('../helpers/responseApi');

exports.hasValidFields = (req, res, next) => {
  if (!Object.keys(req.body).length) {
    return next(error('Missing email or password fields', 400));
  }
  const errors = [];
  if (!req.body.email) {
    errors.push('Missing email field');
  }
  const isValid = emailValidator.validate(req.body.email);
  if (!isValid) {
    errors.push('email is not valid');
  }
  if (!req.body.password) {
    errors.push('Missing password field');
  }
  if (errors.length > 0) {
    return next(error(errors.join(','), 400));
  }
  return next();
};

exports.isPasswordAndUserMatch = async (req, res, next) => {
  try {
    const requestPassword = req.body.password;
    const userDocArr = await UserModel.findByEmail(req.body.email);
    if (!userDocArr || !userDocArr.length) {
      return next(error('Invalid Email-Id', 404));
    }
    const userDoc = userDocArr[0];
    const hashedPasword = userDoc.password;
    const [salt, passwordToken] = hashedPasword.split('$');
    const hash = crypto.createHmac('sha512', salt).update(requestPassword).digest('base64');
    if (hash === passwordToken) {
      req.body = {
        userId: userDoc.id,
        email: userDoc.email,
        role: userDoc.role,
      };
      return next();
    }
    return next(error('Invalid e-mail or password', 400));
  } catch (err) {
    return next(error(err.message, 500));
  }
};
