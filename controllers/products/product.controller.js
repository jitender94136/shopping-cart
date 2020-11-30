const ProductModel = require('../../models/products/product.model');
const ProductCategoryModel = require('../../models/products/productcategory.model');
const crypto = require('crypto');
const ConfigModel = require('../../shared/config');


exports.insert = (req, res) => {
    ProductModel.createProduct(req.body)
        .then((result) => {
            res.status(201).send({id: result._id});
        });

};

exports.insertProductCategories = (req, res) => {
    ProductCategoryModel.createProductCategory(req.body).then((result) => {
        res.status(201).send({id: result._id});
    });
};

exports.listProducts = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    ProductModel.list(limit, page)
        .then((result) => {
            res.status(200).send(result);
        })
};

exports.listCategories = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    ProductCategoryModel.list(limit, page)
        .then((result) => {
            res.status(200).send(result);
        })
};

exports.getProductById = (req, res) => {
    ProductModel.findById(req.params.productId)
        .then((result) => {
            res.status(200).send(result);
        });
};

exports.getProductsByCategoryId = (req, res) => {
    ProductModel.findByCategory(req.params.categoryId)
        .then((result) => {
            res.status(200).send(result);
        });
};

exports.patchProductById = (req, res) => {
    ProductModel.patchById(req.params.productId, req.body)
        .then((result) => {
            res.status(204).send({});
        });
};

exports.getProductCategoryById = (req, res) => {
    ProductCategoryModel.findById(req.params.productId)
        .then((result) => {
            res.status(200).send(result);
        });
};

exports.patchProductCategoryById = (req, res) => {
    ProductCategoryModel.patchById(req.params.categoryId, req.body)
        .then((result) => {
            res.status(204).send({});
        });
};

exports.removeById = (req, res) => {
    ProductModel.removeById(req.params.userId)
        .then((result)=>{
            res.status(204).send({});
        });
};