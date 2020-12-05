const mongoose = require('../../services/repository/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    total : Number,
    active : Number,
    created_on : Date,
    updated_on : Date,
    created_by : Schema.Types.ObjectId
});

cartSchema.set('toJSON', {
    virtuals: true
});

cartSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

const CartModel = mongoose.model('Cart', cartSchema);


const cartProductsSchema = new Schema({
    cart_id : {type: Schema.Types.ObjectId, ref: 'Cart'},
    product_id : {type: Schema.Types.ObjectId, ref: 'Product'},
    quantity : Number,
    sub_total : Number,
    created_on : Date,
    updated_on : Date
});
cartProductsSchema.set('toJSON', {
    virtuals: true
});
cartProductsSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

const CartProductsModel = mongoose.model('CartProducts', cartProductsSchema);

const ProductModel = mongoose.model('Product');

findCartById = async (cartId) => {
    let result = await CartModel.findOne({
        _id : cartId
    });
    result = result.toJSON();
    delete result._id;
    delete result.__v;
    return result;
};

findCartByUserId = async (userId) => {
    let result = await CartModel.findOne({
        created_by : userId,
        active : 1
    });
    console.log(result);
    if(!result) {
        result = await createCart({
            created_by : userId,
        });
    }
    result = result.toJSON();
    delete result.__v;
    return result;
};

//only for authenticated customers
createCart = async (data) => {
    try {
        const cart = new CartModel(data);
        cart.created_on = new Date();
        cart.active = 1;
        let resultDoc = await cart.save();
        return resultDoc;
    } catch (err) {
        console.log(err);
        return {};
    }
};

//TODO: Transaction management pending
exports.insertProductsInCart = async (cartId, data) => {
    try {
        let productId = data.productId;
        let cartProductDoc = await CartProductsModel.findOne({
            cart_id : cartId,
            product_id : productId
        });
        if(cartProductDoc && !cartProductDoc.err) {
            return 0;
        }
        let product = await ProductModel.findById(productId);
        let price = product.price;
        let quantity = data.quantity;
        let subTotal = price * quantity;
        data.sub_total = subTotal;
        data.created_on = new Date();
        data.product_id = productId;
        data.cart_id = cartId;
        let oldCartDoc = await findCartById(cartId);
        let existingTotal = oldCartDoc.total ? oldCartDoc.total : 0;
        let newTotal = existingTotal + subTotal;
        let cartDoc = await patchCartById(cartId,{
            total : newTotal,
            updated_on : new Date()
        });
        let cartProducts = new CartProductsModel(data);
        await cartProducts.save();
        return cartDoc._id;
    } catch (err) {
        return -1;
    }

};

//TODO: transaction management is pending
updateProductInCart = async (cartId, productId, data) => {
    let quantity = data.quantity;
    let product = await ProductModel.findById(productId);
    let price = product.price;
    let newSubTotal = quantity * price;
    let updatedData = {
        quantity: quantity,
        sub_total: newSubTotal
    }
    let oldDoc = await CartProductsModel.findOneAndUpdate({
        "cart_id": cartId,
        "product_id": productId
    }, updatedData);
    let oldSubTotal = oldDoc.sub_total;
    let cart = await findCartById(cartId);
    let totalAmount = cart.total;
    totalAmount = totalAmount - oldSubTotal;
    totalAmount = totalAmount + newSubTotal;
    let oldCartDoc = await patchCartById(cartId, {
        total : totalAmount,
        updated_on : new Date()
    });
    return oldCartDoc;
};

removeProductInCart = async (cartId, productId) => {
    // reduce product subtotal from actual cart
    let cartDoc = await findCartById(cartId);
    let productDoc = await getProductInCart(cartId, productId);
    let subTotal = productDoc.sub_total;
    let updatedTotal = cartDoc.total - subTotal;
    await CartProductsModel.deleteOne({
        "cart_id" : cartId,
        "product_id" : productId
    });
    let oldCartDoc = await patchCartById(cartId, {
        total : updatedTotal,
        updated_on : new Date()
    });
    return oldCartDoc;
};

getProductInCart = async (cartId, productId) => {
    let doc = await CartProductsModel.findOne({
        cart_id : cartId,
        product_id : productId
    });
    doc = doc.toJSON();
    delete doc.__v;
    return doc;
};

getAllProductsInCart = async (cartId) => {
        let result = await CartProductsModel.find({
            cart_id : cartId
        })
        return result;
};

patchCartById = async (id, data) => {
    if(!data) {
        data = {};
    }
    data.updated_on = new Date();
    let oldDoc = await CartModel.findOneAndUpdate({
        _id: id
    }, data);
    return oldDoc;
};

getActiveCartForUser = async (userId) => {
        let cartDoc = await CartModel.findOne({
            created_by : userId,
            active : 1
        });
        return cartDoc;
};

exports.patchCartById = patchCartById;
exports.findCartById = findCartById;
exports.getProductInCart = getProductInCart;
exports.updateProductInCart = updateProductInCart;
exports.removeProductInCart = removeProductInCart;
exports.getAllProductsInCart = getAllProductsInCart;
exports.findCartByUserId = findCartByUserId;
exports.getActiveCartForUser = getActiveCartForUser;