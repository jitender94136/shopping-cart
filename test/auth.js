const chai = require('chai');
const chaiHttp = require('chai-http');
require('dotenv').config();

process.env.NODE_ENV = 'test';
require('../helpers/init_mongodb');
const mongoose = require('mongoose');
const application = require('../index');
const UserModel = require('../models/user');

chai.should();
chai.use(chaiHttp);

describe('POST /login', () => {
  it('A valid jwt access token', (done) => {
    const userData = {
      email: 'jitender.singh@ziwo.com',
      password: 'test',
      first_name: 'jitender',
      middle_name: '',
      last_name: 'singh',
      dob: '27-01-1993',
      contact_number: '9540655406',
      address1: 'C-5, sector 12',
      address2: 'near flyover',
      city: 'hanumangarh',
      state: 'RJ',
      country: 'India',
      pin_code: '335512',
    };
    UserModel.createUser(userData).then(() => {
      chai.request(application)
        .post('/login')
        .send({
          email: 'jitender.singh@ziwo.com',
          password: 'test',
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          done();
        });
    });
  });
});

after((done) => {
  mongoose.connection.db.dropDatabase(done);
});
