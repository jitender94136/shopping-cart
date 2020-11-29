const mongoose = require('../../services/repository/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name : String,
    middle_name : String,
    last_name : String,
    email_id : String,
    password : String,
    dob : String,
    contact_number : String,
    role_id : Number,
    address1 : String,
    address2 : String,
    city : String,
    state : String,
    country : String,
    pin_code : String,
    created_on : Date,
    updated_on : Date
});

userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

userSchema.set('toJSON', {
    virtuals: true
});

const User = mongoose.model('Users', userSchema);

exports.findByEmail = (email) => {
    return User.find({email: email});
};

exports.findById = (id) => {
    return User.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createUser = (userData) => {
    const user = new User(userData);
    return user.save();
};

//only admin would be able to get the list of all the users.
exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        User.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, users) {
                if (err) {
                    reject(err);
                } else {
                    resolve(users);
                }
            })
    });
};

exports.patchUser = (id, userData) => {
    return User.findOneAndUpdate({
        _id: id
    }, userData);
};

