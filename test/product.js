const chai = require('chai');
const chaiHttp = require('chai-http');
require('dotenv').config();

process.env.NODE_ENV = 'test';
require('../helpers/init_mongodb');
const mongoose = require('mongoose');
const application = require('../index');
const ProductModel = require('../models/product');
const ProductCategoryModel = require('../models/productcategory');

process.env.NODE_ENV = 'test';

chai.should();
chai.use(chaiHttp);

let productId = '';
let productCategoryId = '';

describe('Running Product Test Suite', () => {
  it('all product tests should pass', () => {
    const productData = {
      sku: 'vivox5red',
      title: 'VIVO X5',
      quantity: 4,
      price: 800,
      description: 'this is the VIVO phone description',
      pictures: '',
      videos: '',
      limit_per_customer: 2,
    };
    const productCategoryData = {
      category_name: 'Phones',
    };
    ProductCategoryModel.createProductCategory(productCategoryData).then((result) => {
      // eslint-disable-next-line no-underscore-dangle
      productCategoryId = new mongoose.mongo.ObjectId(result._id);
      productData.category_id = mongoose.Types.ObjectId(productCategoryId);
      ProductModel.createProduct(productData).then((product) => {
        productId = product.id;
      });
    });

    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZmM0YTRiN2NlZTdkZDU1NzAzMGNkYWUiLCJlbWFpbCI6Im1haGVuZGVyLnNpbmdoQHppd28uY29tIiwicm9sZSI6MTAwLCJyZWZyZXNoS2V5IjoiV1dvL1ZRZjJ3a0NRWXNTT1FHWVd0UT09IiwiaWF0IjoxNjA2ODczMTM2fQ.1WfWBAlgss11bHfhuSKvvavQnx-iDJnhCbl6CV0Rs3k';

    describe('/POST products', () => {
      const product = {
        sku: 'vivox6blue',
        title: 'VIVO X6',
        category_id: '5fc332a02eedda39243c4e43',
        quantity: 5,
        price: 900,
        description: 'this is the VIVO x6 description',
        pictures: '',
        videos: '',
        limit_per_customer: 3,
      };
      it('it should POST product Data and should create a product', (done) => {
        chai.request(application)
          .post('/products')
          .set({ Authorization: `Bearer ${token}` })
          .send(product)
          .end((err, res) => {
            res.should.have.status(201);
            done();
          });
      });
    });

    describe('/POST productCategories', () => {
      const productCategory = {
        category_name: 'Women',
      };
      it('it should POST productCategory data and should create a productCategory', (done) => {
        chai.request(application)
          .post('/productCategories')
          .set({ Authorization: `Bearer ${token}` })
          .send(productCategory)
          .end((err, res) => {
            res.should.have.status(201);
            done();
          });
      });
    });

    describe('/GET products', () => {
      it('it should GET all the products', (done) => {
        chai.request(application)
          .get('/products')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.greaterThan(0);
            done();
          });
      });
    });

    describe('/GET productCategories', () => {
      it('it should GET all the product categories', (done) => {
        chai.request(application)
          .get('/productCategories')
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('array');
            res.body.length.should.be.greaterThan(0);
            done();
          });
      });
    });

    describe('/PATCH /products/:productId', () => {
      it('it should partially update the data of a product', (done) => {
        chai.request(application)
          .patch(`/products/${productId}`)
          .send({
            price: 2000,
          })
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            res.should.have.status(204);
            done();
          });
      });
    });

    describe('/PATCH /productCategories/:categoryId', () => {
      it('it should partially update the data of a product category', (done) => {
        chai.request(application)
          .patch(`/products/${productCategoryId}`)
          .send({
            category_name: 'SmartPhone',
          })
          .set({ Authorization: `Bearer ${token}` })
          .end((err, res) => {
            res.should.have.status(204);
            done();
          });
      });
    });
  });
});

after((done) => {
  mongoose.connection.db.dropDatabase(done);
});
