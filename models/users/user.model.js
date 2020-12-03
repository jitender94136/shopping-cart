const mongoose = require('../../services/repository/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name : String,
    middle_name : String,
    last_name : String,
    email : String,
    password : String,
    dob : String,
    contact_number : String,
    role : Number,
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

const User = mongoose.model('User', userSchema);


exports.findByEmail = (email) => {
    return User.find({email: email});
};

exports.findById = (id) => {
    return User.findById(id)
        .then((result) => {
            if(!result) {
                return "NO User Available by this userid."
            }
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

exports.patchUser = async (id, userData) => {
    let result = await User.findOneAndUpdate({
        _id: id
    }, userData);
    return result;
};

