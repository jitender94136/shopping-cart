let chai = require('chai');
let chaiHttp = require('chai-http');
let application = require('../index');
chai.should();
chai.use(chaiHttp);
process.env.NODE_ENV = 'test';
before(() => {
    require('../services/repository/mongoose.service');

});

describe("POST /login", () => {
            it("A valid jwt token", () => {
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
                let UserModel = require('../models/users/user.model');
                UserModel.createUser(userData).then((result) => {
                    chai.request(application)
                        .post('/login')
                        .send({
                            email: "jitender.singh@ziwo.com",
                            password: 'test'
                        })
                        .end((err, res) => {
                            res.should.have.status(404);
                            done();
                        });
                });


            });
});


after(function (done) {
    let mongoose = require('../services/repository/mongoose.service').mongoose;
    mongoose.connection.db.dropDatabase(done);
});