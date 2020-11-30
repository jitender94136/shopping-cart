const mongoose = require('../../../services/repository/mongoose.service').mongoose;
const config = require("../../../shared/config");
const SELLER = config.role.SELLER;
const Schema = mongoose.Schema;

const sellerSchema = new Schema({
    user_id: {type: Schema.Types.ObjectId, ref: 'User'},
    logo: String,
    about_us: String
});

sellerSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

sellerSchema.set('toJSON', {
    virtuals: true
});

const Seller = mongoose.model('Seller', sellerSchema);

exports.registerSeller = (data) => {
    const seller = new Seller(data);
    return  seller.save();
};