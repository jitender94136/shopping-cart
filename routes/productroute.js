const {
  getProductsByCategoryId,
  insert,
  insertProductCategories,
  listCategories,
  listProducts,
  patchProductById,
  patchProductCategoryById,
  removeById,
} = require('../controllers/products/product');
const { testMinimumPrivilige } = require('../middlewares/permissionValidator');
const { verifyAccessToken } = require('../helpers/jwt_helper');
require('dotenv').config();

const ADMIN = process.env['ROLE.ADMIN'];
const SELLER = process.env['ROLE.SELLER'];

exports.routes = function (app) {
  // only seller or admin can add a product
  app.post('/products', [
    verifyAccessToken,
    testMinimumPrivilige(SELLER),
    insert,
  ]);

  // only admin can add a product category
  app.post('/productCategories', [
    verifyAccessToken,
    testMinimumPrivilige(ADMIN),
    insertProductCategories,
  ]);

  app.get('/products', [
    listProducts,
  ]);

  app.get('/productCategories', [
    listCategories,
  ]);

  app.get('/productCategories/:categoryId/products', [
    getProductsByCategoryId,
  ]);

  // TODO: only the seller that created the product can update the product (pending)
  app.patch('/products/:productId', [
    verifyAccessToken,
    testMinimumPrivilige(SELLER),
    patchProductById,
  ]);

  app.patch('/productCategories/:categoryId', [
    verifyAccessToken,
    testMinimumPrivilige(ADMIN),
    patchProductCategoryById,
  ]);

  // TODO: only the seller that created the product can delete the product resource (pending)
  app.delete('/products/:productId', [
    verifyAccessToken,
    testMinimumPrivilige(SELLER),
    removeById,
  ]);
};
