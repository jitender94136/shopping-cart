const CartModel = require('../../models/cart/cart.model')


exports.insertProduct = async (req, res) => {
    let cartId = req.params.cartId;
    await CartModel.insertProductsInCart(cartId, req.body);
    res.status(201).send({});
};

exports.updateProduct = async (req, res) => {
    let cartId = req.params.cartId;
    let productId = req.params.productId;
    await CartModel.updateProductInCart(cartId, productId, req.body);
    res.status(204).send({});
};

exports.removeProduct = async (req, res) => {
    let cartId = req.params.cartId;
    let productId = req.params.productId;
    await CartModel.removeProductInCart(cartId, productId);
    res.status(200).send({});
};

exports.getProductInCart = (req, res) => {
    let cartId = req.params.cartId;
    let productId = req.params.productId;
    let doc = CartModel.getProductInCart(cartId, productId);
    res.status(200).send(doc);
};

//TODO: get product details from referenced product collection
exports.list = async (req, res) => {
    let cartId = req.params.cartId;
    let result = await CartModel.getAllProductsInCart(cartId);
    res.status(200).send(result);
};

exports.getById = (req, res) => {
    let result = CartModel.findCartById(req.params.cartId)
    res.status(200).send(result);
};

exports.getCartByUserId = async (req, res) => {
    let result = await CartModel.findCartByUserId(req.params.userId);
    console.log(result);
    if(!result) {
        res.status(500).send({});
    }
    res.status(200).send(result);
};