const chai = require('chai');
const chaiHttp = require('chai-http');
require('dotenv').config();

process.env.NODE_ENV = 'test';
require('../helpers/init_mongodb');
const mongoose = require('mongoose');
const application = require('../index');
const UserModel = require('../models/user');

process.env.NODE_ENV = 'test';

chai.should();
chai.use(chaiHttp);

const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZmM0YTRiN2NlZTdkZDU1NzAzMGNkYWUiLCJlbWFpbCI6Im1haGVuZGVyLnNpbmdoQHppd28uY29tIiwicm9sZSI6MTAwLCJyZWZyZXNoS2V5IjoiV1dvL1ZRZjJ3a0NRWXNTT1FHWVd0UT09IiwiaWF0IjoxNjA2ODczMTM2fQ.1WfWBAlgss11bHfhuSKvvavQnx-iDJnhCbl6CV0Rs3k';

describe('Running Cart Test Suite', () => {
  it('all cart tests should pass', () => {
    describe('/GET /cart/', () => {
      it('it should NOT GET the cart associated with user.', (done) => {
        chai.request(application)
          .get('/cart/')
          .end((err, res) => {
            res.should.have.status(404);
            done();
          });
      });
    });

    describe('/GET /cart/:userId', () => {
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
      it('it should GET the cart associated with user.', (done) => {
        UserModel.createUser(userData).then(({ _id: userId }) => {
          chai.request(application)
            .get(`/cart/${userId}`)
            .set({ Authorization: `Bearer ${token}` })
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.have.property('_id');
              done();
            });
        });
      });
    });
  });
});

after((done) => {
  mongoose.connection.db.dropDatabase(done);
});
