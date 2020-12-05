const mongoose = require('../../services/repository/mongoose.service').mongoose;
const CartModel = require('../../models/cart/cart.model');
const ProductModel = require('../../models/products/product.model');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    cart_id : Schema.Types.ObjectId,
    total : Number,
    created_on : Date,
    updated_on : Date,
    created_by : Schema.Types.ObjectId
});

orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

orderSchema.set('toJSON', {
    virtuals: true
});

const Order = mongoose.model('Order', orderSchema);

const orderProductsSchema = new Schema({
    order_id : {type: Schema.Types.ObjectId, ref: 'Order'},
    product_id : {type: Schema.Types.ObjectId, ref: 'Product'},
    product_name : String,
    price : Number,
    quantity: Number,
    sub_total : Number,
    created_on : Date,
    updated_on : Date
});


orderProductsSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

orderProductsSchema.set('toJSON', {
    virtuals: true
});

const OrderProductsModel = mongoose.model('OrderProducts', orderProductsSchema);

exports.getOrderDetail = async (id) => {
    try {
        let result = await Order.findById(id);
        result = result.toJSON();
        delete result.__v;
        let orderId = result.id;
        let orderItems = await OrderProductsModel.find({
            order_id : orderId
        });
        result.orderItems = orderItems;
        return result;
    } catch (err) {
        console.log('loggin error ', err);
    }
    return false;
};

exports.placeOrder = async (userId) => {
    try {
        let cartDoc = await CartModel.getActiveCartForUser(userId);
        if(!cartDoc || cartDoc.err) {
            return 0;
        }
        let data = {};
        data.cart_id = cartDoc.id;
        data.created_by = userId;
        data.created_on = new Date();
        data.total = cartDoc.total;
        await CartModel.patchCartById(data.cart_id, {
            active : 0,
            updated_on : new Date()
        })
        let newOrder = new Order(data);
        let orderDoc = await newOrder.save();
        let orderId = orderDoc.id;
        let productDocs = await CartModel.getAllProductsInCart(cartDoc.id);
        for(let entry in productDocs) {
            entry = productDocs[entry]._doc;
            let orderItemData = {};
            let productId = entry.product_id;
            let productDetails = await ProductModel.findById(productId);
            orderItemData.order_id = orderId;
            orderItemData.product_id = productId;
            orderItemData.price = productDetails.price;
            orderItemData.product_name = productDetails.title;
            orderItemData.quantity = entry.quantity;
            orderItemData.sub_total = entry.sub_total;
            orderItemData.created_on = new Date();
            let orderItemEntry = new OrderProductsModel(orderItemData);
            await orderItemEntry.save();
        }
        return orderId;
    } catch (err) {
        return -1;
    }
};