let chai = require('chai');
let chaiHttp = require('chai-http');
let application = require('../index');
chai.should();
chai.use(chaiHttp);
process.env.NODE_ENV = 'test';
let UserModel = require('../models/users/user.model');

before(() => {
    require('../services/repository/mongoose.service');
});
let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZmM0YTRiN2NlZTdkZDU1NzAzMGNkYWUiLCJlbWFpbCI6Im1haGVuZGVyLnNpbmdoQHppd28uY29tIiwicm9sZSI6MTAwLCJyZWZyZXNoS2V5IjoiV1dvL1ZRZjJ3a0NRWXNTT1FHWVd0UT09IiwiaWF0IjoxNjA2ODczMTM2fQ.1WfWBAlgss11bHfhuSKvvavQnx-iDJnhCbl6CV0Rs3k';

describe("Running Cart Test Suite", () => {
    it("all cart tests should pass", () => {
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
            let userData = {
                "email" : "jitender.singh@ziwo.com",
                "password" : "test",
                "first_name" : "jitender",
                "middle_name" : "",
                "last_name" : "singh",
                "dob" : "27-01-1993",
                "contact_number" : "9540655406",
                "address1" : "C-5, sector 12",
                "address2" : "near flyover",
                "city" : "hanumangarh",
                "state" : "RJ",
                "country" : "India",
                "pin_code" : "335512"
            };
            it('it should GET the cart associated with user.', (done) => {
                UserModel.createUser(userData).then((result) => {
                        let userId = result._id;
                        chai.request(application)
                            .get('/cart/' +  userId)
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

after(function (done) {
    let mongoose = require('../services/repository/mongoose.service').mongoose;
    mongoose.connection.db.dropDatabase(done);
});
