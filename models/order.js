const mongoose = require('mongoose');
const CartModel = require('./cart');
const ProductModel = require('./product');

const { Schema } = mongoose;

const orderSchema = new Schema({
  cart_id: Schema.Types.ObjectId,
  total: Number,
  created_on: Date,
  updated_on: Date,
  created_by: Schema.Types.ObjectId,
});

orderSchema.virtual('id').get(function () {
  // eslint-disable-next-line no-underscore-dangle
  return this._id.toHexString();
});

orderSchema.set('toJSON', {
  virtuals: true,
});

const Order = mongoose.model('Order', orderSchema);

const orderProductsSchema = new Schema({
  order_id: { type: Schema.Types.ObjectId, ref: 'Order' },
  product_id: { type: Schema.Types.ObjectId, ref: 'Product' },
  product_name: String,
  price: Number,
  quantity: Number,
  sub_total: Number,
  created_on: Date,
  updated_on: Date,
});

orderProductsSchema.virtual('id').get(function () {
  // eslint-disable-next-line no-underscore-dangle
  return this._id.toHexString();
});

orderProductsSchema.set('toJSON', {
  virtuals: true,
});

const OrderProductsModel = mongoose.model('OrderProducts', orderProductsSchema);

exports.getOrderDetail = async (id) => {
  let result = await Order.findById(id, { __v: 0 });
  if (!result) {
    return false;
  }
  result = result.toJSON();
  const orderId = result.id;
  const orderItems = await OrderProductsModel.find({
    order_id: orderId,
  });
  result.orderItems = orderItems;
  return result;
};

exports.placeOrder = async (userId) => {
  try {
    const cartDoc = await CartModel.getActiveCartForUser(userId);
    if (!cartDoc || cartDoc.err) {
      return 0;
    }
    const data = {};
    data.cart_id = cartDoc.id;
    data.created_by = userId;
    data.created_on = new Date();
    data.total = cartDoc.total;
    await CartModel.patchCartById(data.cart_id, {
      active: 0,
      updated_on: new Date(),
    });
    const newOrder = new Order(data);
    const orderDoc = await newOrder.save();
    const orderId = orderDoc.id;
    const productDocs = await CartModel.getAllProductsInCart(cartDoc.id);
    const entries = Object.entries(productDocs);
    for (let i = 0; i < entries.length; i += 1) {
      let entry = entries[i];
      // eslint-disable-next-line no-underscore-dangle
      entry = productDocs[entry]._doc;
      const orderItemData = {};
      const productId = entry.product_id;
      // eslint-disable-next-line no-await-in-loop
      const productDetails = await ProductModel.findById(productId);
      orderItemData.order_id = orderId;
      orderItemData.product_id = productId;
      orderItemData.price = productDetails.price;
      orderItemData.product_name = productDetails.title;
      orderItemData.quantity = entry.quantity;
      orderItemData.sub_total = entry.sub_total;
      orderItemData.created_on = new Date();
      const orderItemEntry = new OrderProductsModel(orderItemData);
      // eslint-disable-next-line no-await-in-loop
      await orderItemEntry.save();
    }
    return orderId;
  } catch (err) {
    return -1;
  }
};
