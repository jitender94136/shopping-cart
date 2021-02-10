const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProductCategorySchema = new Schema({
  category_name: String,
  created_by: mongoose.Types.ObjectId,
  updated_by: mongoose.Types.ObjectId,
  created_on: Date,
  updated_on: Date,
});

ProductCategorySchema.virtual('id').get(function () {
  // eslint-disable-next-line no-underscore-dangle
  return this._id.toHexString();
});

ProductCategorySchema.set('toJSON', {
  virtuals: true,
});

const ProductCategory = mongoose.model('ProductCategory', ProductCategorySchema);

exports.findById = (id) => ProductCategory.findById(id, { _id: 0, __v: 0 })
  .then((result) => {
    const docs = result.toJSON();
    return docs;
  });

exports.createProductCategory = (data) => {
  let productCategoryData = data;
  if (!productCategoryData) {
    productCategoryData = {};
  }
  productCategoryData.created_on = new Date();
  const productCategory = new ProductCategory(productCategoryData);
  return productCategory.save();
};

exports.list = (limit, page) => new Promise((resolve, reject) => {
  ProductCategory.find()
    .limit(limit)
    .skip(limit * page)
    .exec((err, pcats) => {
      if (err) {
        reject(err);
      } else {
        resolve(pcats);
      }
    });
});

exports.patchById = (id, data) => {
  let productCategoryData = data;
  if (!productCategoryData) {
    productCategoryData = {};
  }
  productCategoryData.updated_on = new Date();
  return ProductCategory.findOneAndUpdate({
    _id: id,
  }, productCategoryData);
};

exports.removeById = (id) => new Promise((resolve, reject) => {
  ProductCategory.deleteMany({ _id: id }, (err) => {
    if (err) {
      reject(err);
    } else {
      resolve(err);
    }
  });
});
