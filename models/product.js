const mongoose = require('mongoose');

const { Schema } = mongoose;

const productSchema = new Schema({
  sku: String,
  title: String,
  category_id: { type: Schema.Types.ObjectId, ref: 'ProductCategory' },
  quantity: String,
  price: Number,
  description: String,
  pictures: String,
  videos: String,
  limit_per_customer: Number,
  created_on: Date,
  updated_on: Date,
});

productSchema.virtual('id').get(function () {
  // eslint-disable-next-line no-underscore-dangle
  return this._id.toHexString();
});

productSchema.set('toJSON', {
  virtuals: true,
});

const Product = mongoose.model('Product', productSchema);

exports.findByCategory = (categoryId) => Product.find({ category_id: categoryId });

exports.findById = async (id) => {
  let result = await Product.findById(id, {
    __v: 0,
  });
  result = result.toJSON();
  return result;
};

exports.createProduct = (data) => {
  const product = new Product(data);
  product.created_on = new Date();
  return product.save();
};

exports.list = (limit, page) => new Promise((resolve, reject) => {
  Product.find()
    .skip(limit * page)
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        reject(err);
      } else {
        resolve(products);
      }
    });
});

exports.patchById = (id, data) => {
  let productData = data;
  if (!productData) {
    productData = {};
  }
  productData.updated_on = new Date();
  return Product.findOneAndUpdate({
    _id: id,
  }, productData);
};

exports.removeById = (id) => new Promise((resolve, reject) => {
  Product.deleteOne({ _id: id }, (err) => {
    if (err) {
      reject(err);
    } else {
      resolve();
    }
  });
});
