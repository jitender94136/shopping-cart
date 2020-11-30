const mongoose = require('../../services/repository/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const productSchema = new Schema({
    sku : String,
    title : String,
    category_id : {type: Schema.Types.ObjectId, ref: 'ProductCategory'},
    quantity : String,
    price : Number,
    description : String,
    pictures : String,
    videos : String,
    limit_per_customer : Number,
    created_on : Date,
    updated_on : Date
});

productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true
});

const Product = mongoose.model('Product', productSchema);


exports.findByCategory = (categoryId) => {
    return Product.find({category_id : categoryId});
};

exports.findById = (id) => {
    return Product.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createProduct = (data) => {
    const product = new Product(data);
    product.created_on = new Date();
    return product.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Product.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, products) {
                if (err) {
                    reject(err);
                } else {
                    resolve(products);
                }
            })
    });
};

exports.patchById = (id, data) => {
    if(!data) {
        data = {};
    }
    data.updated_on = new Date();
    return Product.findOneAndUpdate({
        _id: id
    }, data);
};

exports.removeById = (id) => {
    return new Promise((resolve, reject) => {
        Product.deleteMany({_id: id}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};