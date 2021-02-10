const CartModel = require('../../models/cart');
const { success, error } = require('../../helpers/responseApi');

exports.insertProduct = async (req, res, next) => {
  try {
    const { cartId } = req.params;
    const result = await CartModel.insertProductsInCart(cartId, req.body);
    if (result === 0) {
      return next(success({ message: 'Item already present in the Cart', code: 200 }));
    }
    if (result === -1) {
      return next(error('Unable to process the request', 500));
    }
    return next(success({ code: 201 }));
  } catch (err) {
    return next(error(err.message, 500));
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { cartId } = req.params;
    const { productId } = req.params;
    await CartModel.updateProductInCart(cartId, productId, req.body);
    return next(success({ code: 204 }));
  } catch (err) {
    return next(error(err.message, 500));
  }
};

exports.removeProduct = async (req, res, next) => {
  try {
    const { cartId } = req.params;
    const { productId } = req.params;
    await CartModel.removeProductInCart(cartId, productId);
    return next(success({ code: 200 }));
  } catch (err) {
    return next(error(err.message, 500));
  }
};

exports.getProductInCart = (req, res, next) => {
  try {
    const { cartId } = req.params;
    const { productId } = req.params;
    const doc = CartModel.getProductInCart(cartId, productId);
    return next(success({ results: { product: doc }, code: 200 }));
  } catch (err) {
    return next(error(err.message, 500));
  }
};

// TODO: get product details from referenced product collection
exports.list = async (req, res, next) => {
  try {
    const { cartId } = req.params;
    const result = await CartModel.getAllProductsInCart(cartId);
    return next(success({ results: { products: result }, code: 200 }));
  } catch (err) {
    return next(error(err.message, 500));
  }
};

exports.getById = (req, res, next) => {
  try {
    const result = CartModel.findCartById(req.params.cartId);
    return next(success({ results: { cart: result }, code: 200 }));
  } catch (err) {
    return next(error(err.message, 500));
  }
};

exports.getCartByUserId = async (req, res, next) => {
  try {
    const result = await CartModel.findCartByUserId(req.params.userId);
    return next(success({ results: { cart: result }, code: 200 }));
  } catch (err) {
    return next(error(err.message, 500));
  }
};
