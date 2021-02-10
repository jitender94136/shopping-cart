const mongoose = require('mongoose');

const SELLER = process.env['ROLE.SELLER'];
const { Schema } = mongoose;

const sellerSchema = new Schema({
  logo: String,
  about_us: String,
  address: String,
});

const userSchema = new Schema({
  first_name: String,
  middle_name: String,
  last_name: String,
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dob: String,
  contact_number: String,
  role: Number,
  address1: String,
  address2: String,
  city: String,
  state: String,
  country: String,
  pin_code: String,
  created_on: Date,
  updated_on: Date,
  seller: sellerSchema,
});

const User = mongoose.model('User', userSchema);

exports.findByEmail = async (email) => User.find({ email }).exec();

exports.findById = async (id) => User.findById(id, { _id: 0, password: 0, __v: 0 }).exec();

exports.createUser = async (userData) => {
  const user = new User(userData);
  return user.save();
};

// only admin would be able to get the list of all the users.
exports.list = async (limit, page) => User.find({}).skip(limit * page).limit(limit);

exports.patchUser = async (id, userData) => User.findOneAndUpdate({ _id: id }, userData);

exports.registerSeller = async (userId, data) => {
  const userDoc = await User.findOne({ _id: userId });
  console.log(userDoc);
  userDoc.role = SELLER;
  userDoc.seller = data;
  await userDoc.save();
};
