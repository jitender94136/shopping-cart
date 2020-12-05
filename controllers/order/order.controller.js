const OrderModel = require('../../models/order/order.model')

exports.placeOrder = async (req, res) => {
    let userId = req.params.userId;
    let result = await OrderModel.placeOrder(userId, req.body);
    if(result == 0) {
        res.status(200).send("Cart is Empty. Please add items in the cart to place an order");
    } else if(result == -1) {
        res.status(500).send("Unable to serve request at this point");
    } else {
        res.status(201).send({order_id : result});
    }
};

//TODO: get product details from referenced product collection
exports.list = async (req, res) => {
    let orderId = req.params.orderId;
    let result = await OrderModel.getOrderDetail(orderId);
    if(!result) {
        res.status(200).send("No data available against this orderId");
    }
    res.status(200).send(result);
};