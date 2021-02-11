const OrderModel = require('../../models/order');
const { success, error } = require('../../helpers/responseApi');

exports.placeOrder = async (req, res, next) => {
  const { userId } = req.params;
  const result = await OrderModel.placeOrder(userId, req.body);
  if (result === 0) {
    return next(success({
      message: 'Cart is Empty. Please add items in the cart to place an order',
      code: 200,
    }));
  }
  if (result === -1) {
    return next(error('Unable to serve request at this point', 500));
  }
  return next(success({ results: { order_id: result }, code: 201 }));
};

exports.list = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const result = await OrderModel.getOrderDetail(orderId);
    if (!result) {
      return next(success({ message: 'No data available', code: 200 }));
    }
    return next(success({ results: { result }, code: 200 }));
  } catch (err) {
    return next(error(err.message, 500));
  }
};
