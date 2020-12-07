process.env.NODE_ENV = 'test';
let chai = require('chai');
let chaiHttp = require('chai-http');
let application = require('../index');
chai.should();
chai.use(chaiHttp);

before(() => {
    require('../services/repository/mongoose.service');
});
describe('Running user tests', () => {
    let userId = "";
    it("All user tests should pass", () => {
        describe("GET Fixture for user testing", () => {
            let UserModel = require('../models/users/user.model');
            let userData = {
                "email" : "surya.singh@ziwo.com",
                "password" : "test",
                "first_name" : "surya",
                "middle_name" : "",
                "last_name" : "singh",
                "dob" : "27-01-1993",
                "contact_number" : "9540655406",
                "address1" : "C-5, sector 12",
                "address2" : "near flyover",
                "city" : "baliya",
                "state" : "RJ",
                "country" : "India",
                "pin_code" : "335512"
            };
            UserModel.createUser(userData).then((result) => {
                result = result.toJSON();
                userId = result.id;
            });
        });


        let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ZmM0YTRiN2NlZTdkZDU1NzAzMGNkYWUiLCJlbWFpbCI6Im1haGVuZGVyLnNpbmdoQHppd28uY29tIiwicm9sZSI6MTAwLCJyZWZyZXNoS2V5IjoiV1dvL1ZRZjJ3a0NRWXNTT1FHWVd0UT09IiwiaWF0IjoxNjA2ODczMTM2fQ.1WfWBAlgss11bHfhuSKvvavQnx-iDJnhCbl6CV0Rs3k';

        describe('/POST users', () => {
            let userData = {
                "email" : "dharmender.singh@ziwo.com",
                "password" : "test",
                "first_name" : "dharmender",
                "middle_name" : "",
                "last_name" : "singh",
                "dob" : "27-01-1993",
                "contact_number" : "9540655406",
                "address1" : "C-5, sector 12",
                "address2" : "near flyover",
                "city" : "baliya",
                "state" : "RJ",
                "country" : "India",
                "pin_code" : "335512"
            };
            it('it should POST user Data and should create a user', (done) => {
                chai.request(application)
                    .post('/users')
                    .send(userData)
                    .end((err, res) => {
                        res.should.have.status(201);
                        done();
                    });
            });
        });

        describe('/GET users', () => {
            it('it should GET all the users', (done) => {
                chai.request(application)
                    .get('/users')
                    .set({ Authorization: `Bearer ${token}` })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.be.a('array');
                        done();
                    });
            });
        });


        describe('/GET users', () => {
            it('it should not GET the users data because of missing header', (done) => {
                chai.request(application)
                    .get('/users')
                    .end((err, res) => {
                        res.should.have.status(401);
                        done();
                    });
            });
        });

        describe('/GET /users/:userId', () => {
            it('it should GET a single user by id', (done) => {
                chai.request(application)
                    .get('/users/' + userId)
                    .set({Authorization: `Bearer ${token}`})
                    .end((err, res) => {
                        res.should.have.status(200),
                            res.body.should.have.property('id');
                        res.body.should.have.property('first_name');
                        res.body.should.have.property('email').eq('surya.singh@ziwo.com');
                        done();
                    });
            });
        });

        describe('/PATCH /users/:userId', () => {
            it('it should partially update the data of a user', (done) => {
                chai.request(application)
                    .patch('/users/' + userId)
                    .send({
                        last_name : 'sing'
                    })
                    .set({Authorization: `Bearer ${token}`})
                    .end((err, res) => {
                        res.should.have.status(204)
                        done();
                    });
            });
        });
    });

});

after(function (done) {
    let mongoose = require('../services/repository/mongoose.service').mongoose;
    mongoose.connection.db.dropDatabase(done);
});

