const crypto = require('crypto');
const userModel = require('../../models/user');
const { success, error } = require('../../helpers/responseApi');
const { cleanPagingParams } = require('../../helpers/util');
require('dotenv').config();

const CUSTOMER = process.env['ROLE.CUSTOMER'];

exports.insert = async function (req, res, next) {
  try {
    const salt = crypto.randomBytes(16).toString('base64');
    const hash = crypto.createHmac('sha512', salt).update(req.body.password).digest('base64');
    req.body.password = `${salt}$${hash}`;
    req.body.role = CUSTOMER;
    await userModel.createUser(req.body);
    const successResponse = { results: {}, message: 'User Created Successfully', code: 201 };
    return res.send(success(successResponse));
  } catch (err) {
    return next(error(err.message, 500));
  }
};

exports.insertSeller = async (req, res, next) => {
  try {
    const { userId } = req.params;
    await userModel.registerSeller(userId, req.body);
    next(success({ code: 201 }));
  } catch (err) {
    next(error(err.message, 500));
  }
};

exports.list = async (req, res, next) => {
  try {
    const { cleanLimit, cleanPage } = cleanPagingParams(req.query.limit, req.query.page);
    const docs = await userModel.list(cleanLimit, cleanPage);
    const successResponse = { results: { docs }, code: 200 };
    return res.send(success(successResponse));
  } catch (err) {
    return next(error(err.message, 500));
  }
};

exports.getById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const userDoc = await userModel.findById(userId);
    const successResponse = { results: { userDoc }, code: 200 };
    return res.send(success(successResponse));
  } catch (err) {
    return next(error(err.message, 500));
  }
};

exports.patchById = async (req, res) => {
  if (req.body.password) {
    const salt = crypto.randomBytes(16).toString('base64');
    const hash = crypto.createHmac('sha512', salt).update(req.body.password).digest('base64');
    req.body.password = `${salt}$${hash}`;
  }
  await userModel.patchUser(req.params.userId, req.body);
  const successResponse = { code: 204 };
  res.send(success(successResponse));
};
