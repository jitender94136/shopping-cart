const userModel = require('../../models/users/user.model');
const sellerModel = require('../../models/users/seller/seller.model');
const crypto = require('crypto');
const ConfigModel = require('../../shared/config');
const SELLER = ConfigModel.role.SELLER;

exports.insert = (req, res) => {
    let salt = crypto.randomBytes(16).toString('base64');
    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
    req.body.password = salt + "$" + hash;
    req.body.role = ConfigModel.role.CUSTOMER;
    userModel.createUser(req.body)
        .then((result) => {
            res.status(201).send({id: result._id});
        });
};

exports.insertSeller = (req, res) => {
    sellerModel.registerSeller(req.body).then((result) => {
        let sellerId = result._id;
        userModel.patchUser(req.body.user_id, { role :  SELLER}).then((output) => {
              res.status(201).send({id: sellerId});
        });
    });
};

exports.list = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    userModel.list(limit, page)
        .then((result) => {
            res.status(200).send(result);
        })
};

exports.getById = (req, res) => {
    userModel.findById(req.params.userId)
        .then((result) => {
            res.status(200).send(result);
        });
};

exports.patchById = async (req, res) => {
    if (req.body.password) {
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
        req.body.password = salt + "$" + hash;
    }

    let result = await userModel.patchUser(req.params.userId, req.body);
    console.log(result);
    res.status(204).send({});
};