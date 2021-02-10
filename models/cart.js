const mongoose = require('mongoose');

const { Schema } = mongoose;

const cartSchema = new Schema({
  total: Number,
  active: Number,
  created_on: Date,
  updated_on: Date,
  created_by: Schema.Types.ObjectId,
});

cartSchema.set('toJSON', {
  virtuals: true,
});

cartSchema.virtual('id').get(function () {
// eslint-disable-next-line no-underscore-dangle
  return this._id.toHexString();
});

const CartModel = mongoose.model('Cart', cartSchema);

const cartProductsSchema = new Schema({
  cart_id: { type: Schema.Types.ObjectId, ref: 'Cart' },
  product_id: { type: Schema.Types.ObjectId, ref: 'Product' },
  quantity: Number,
  sub_total: Number,
  created_on: Date,
  updated_on: Date,
});
cartProductsSchema.set('toJSON', {
  virtuals: true,
});
cartProductsSchema.virtual('id').get(function () {
  // eslint-disable-next-line no-underscore-dangle
  return this._id.toHexString();
});

const CartProductsModel = mongoose.model('CartProducts', cartProductsSchema);

const ProductModel = mongoose.model('Product');

async function findCartById(cartId) {
  let result = await CartModel.findOne({ _id: cartId }, { _id: 0, __v: 0 });
  result = result.toJSON();
  return result;
}

// only for authenticated customers
async function createCart(data) {
  try {
    const cart = new CartModel(data);
    cart.created_on = new Date();
    cart.active = 1;
    const resultDoc = await cart.save();
    return resultDoc;
  } catch (err) {
    console.log(err);
    return {};
  }
}

async function patchCartById(id, data) {
  let cartData = data;
  if (!cartData) {
    cartData = {};
  }
  cartData.updated_on = new Date();
  const oldDoc = await CartModel.findOneAndUpdate({
    _id: id,
  }, cartData);
  return oldDoc;
}

exports.patchCartById = patchCartById;

exports.findCartByUserId = async (userId) => {
  let result = await CartModel.findOne({
    created_by: userId,
    active: 1,
  }, { __v: 0 });
  if (!result) {
    result = await createCart({ created_by: userId }, { __v: 0 });
  }
  result = result.toJSON();
  return result;
};

exports.insertProductsInCart = async (cartId, data) => {
  try {
    const productData = data;
    const { productId } = productData;
    const cartProductDoc = await CartProductsModel.findOne({
      cart_id: cartId,
      product_id: productId,
    });
    if (cartProductDoc && !cartProductDoc.err) {
      return 0;
    }
    const product = await ProductModel.findById(productId);
    const { price } = product;
    const { quantity } = productData;
    const subTotal = price * quantity;
    productData.sub_total = subTotal;
    productData.created_on = new Date();
    productData.product_id = productId;
    productData.cart_id = cartId;
    const oldCartDoc = await findCartById(cartId);
    const existingTotal = oldCartDoc.total ? oldCartDoc.total : 0;
    const newTotal = existingTotal + subTotal;
    const cartDoc = await patchCartById(cartId, {
      total: newTotal,
      updated_on: new Date(),
    });
    const cartProducts = new CartProductsModel(data);
    await cartProducts.save();
    return cartDoc.id;
  } catch (err) {
    return -1;
  }
};

async function getProductInCart(cartId, productId) {
  let doc = await CartProductsModel.findOne({
    cart_id: cartId,
    product_id: productId,
  }, {
    __v: 0,
  });
  doc = doc.toJSON();
  return doc;
}

exports.getProductInCart = getProductInCart;

exports.updateProductInCart = async (cartId, productId, data) => {
  const { quantity } = parseInt(data, 10);
  const product = await ProductModel.findById(productId);
  const { price } = product;
  const newSubTotal = quantity * price;
  const updatedData = {
    quantity,
    sub_total: newSubTotal,
  };
  const oldDoc = await CartProductsModel.findOneAndUpdate({
    cart_id: cartId,
    product_id: productId,
  }, updatedData);
  const oldSubTotal = oldDoc.sub_total;
  const cart = await findCartById(cartId);
  let totalAmount = cart.total;
  totalAmount -= oldSubTotal;
  totalAmount += newSubTotal;
  const oldCartDoc = await patchCartById(cartId, {
    total: totalAmount,
    updated_on: new Date(),
  });
  return oldCartDoc;
};

exports.removeProductInCart = async (cartId, productId) => {
  // reduce product subtotal from actual cart
  const cartDoc = await findCartById(cartId);
  const productDoc = await getProductInCart(cartId, productId);
  const subTotal = productDoc.sub_total;
  const updatedTotal = cartDoc.total - subTotal;
  await CartProductsModel.deleteOne({
    cart_id: cartId,
    product_id: productId,
  });
  const oldCartDoc = await patchCartById(cartId, {
    total: updatedTotal,
    updated_on: new Date(),
  });
  return oldCartDoc;
};

exports.getAllProductsInCart = async (cartId) => {
  const result = await CartProductsModel.find({
    cart_id: cartId,
  });
  return result;
};

exports.getActiveCartForUser = async (userId) => {
  const cartDoc = await CartModel.findOne({
    created_by: userId,
    active: 1,
  });
  return cartDoc;
};
