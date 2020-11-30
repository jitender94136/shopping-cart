const mongoose = require('../../services/repository/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const ProductCategorySchema = new Schema({
    category_name : String,
    created_by : mongoose.Types.ObjectId,
    updated_by : mongoose.Types.ObjectId,
    created_on : Date,
    updated_on : Date
});

ProductCategorySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

ProductCategorySchema.set('toJSON', {
    virtuals: true
});

const ProductCategory = mongoose.model('ProductCategory', ProductCategorySchema);

exports.findById = (id) => {
    return ProductCategory.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createProductCategory = (data) => {
    if(!data) {
        data = {};
    }
    data.created_on = new Date();
    const productCategory = new ProductCategory(data);
    return productCategory.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        ProductCategory.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, pcats) {
                if (err) {
                    reject(err);
                } else {
                    resolve(pcats);
                }
            })
    });
};

exports.patchById = (id, data) => {
    if(!data) {
        data = {};
    }
    data.updated_on = new Date();
    return ProductCategory.findOneAndUpdate({
        _id: id
    }, data);
};

exports.removeById = (id) => {
    return new Promise((resolve, reject) => {
        ProductCategory.deleteMany({_id: id}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};