const ProductModel = require('../../models/product');
const {
  createProductCategory, findById, list, patchById,
} = require('../../models/productcategory');
const { cleanPagingParams } = require('../../helpers/util');
const { success, error } = require('../../helpers/responseApi');

exports.insert = (req, res, next) => {
  ProductModel.createProduct(req.body)
    .then((result) => {
      next(success({ code: 201, results: { id: result.id } }));
    }).catch((err) => {
      next(error(err.messsage, 500));
    });
};

exports.insertProductCategories = (req, res, next) => {
  createProductCategory(req.body).then((result) => {
    const successResponse = { results: { id: result.id }, code: 201 };
    return next(success(successResponse));
  }).catch((err) => next(error(err.message, 500)));
};

exports.listProducts = (req, res, next) => {
  const { cleanLimit, cleanPage } = cleanPagingParams(req.query.limit, req.query.page);
  ProductModel.list(cleanLimit, cleanPage)
    .then((result) => {
      next(success({ results: { products: result }, code: 200 }));
    }).catch((err) => {
      next(error(err.message, 500));
    });
};

exports.listCategories = (req, res, next) => {
  const { cleanLimit, cleanPage } = cleanPagingParams(req.query.limit, req.query.page);
  list(cleanLimit, cleanPage)
    .then((result) => {
      next(success({ results: { productCategories: result }, code: 200 }));
    }).catch((err) => next(error(err.message, 500)));
};

exports.getProductById = async (req, res, next) => {
  try {
    const result = await ProductModel.findById(req.params.productId);
    return next(success({ results: { product: result, code: 200 } }));
  } catch (err) {
    return next(error(err.message, 500));
  }
};

exports.getProductsByCategoryId = (req, res, next) => {
  ProductModel.findByCategory(req.params.categoryId)
    .then((result) => {
      const successResponse = { results: { products: result }, code: 200 };
      next(success(successResponse));
    }).catch((err) => next(error(err.message, 500)));
};

exports.patchProductById = (req, res, next) => {
  ProductModel.patchById(req.params.productId, req.body)
    .then(() => next(success({ code: 204 })))
    .catch((err) => next(error(err.message, 500)));
};

exports.getProductCategoryById = (req, res, next) => {
  findById(req.params.productId)
    .then((result) => {
      const successResponse = { results: { productCategory: result }, code: 200 };
      next(success(successResponse));
    }).catch((err) => next(error(err.message, 500)));
};

exports.patchProductCategoryById = (req, res, next) => {
  patchById(req.params.categoryId, req.body)
    .then(() => {
      next(success({ code: 204 }));
    }).catch((err) => next(error(err.message, 500)));
};

exports.removeById = (req, res, next) => {
  ProductModel.removeById(req.params.userId)
    .then(() => {
      next(success({ code: 204 }));
    }).catch((err) => next(error(err.message, 500)));
};
