const mongoose = require('../../services/repository/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const sellerSchema = new Schema({
    user_id: [{type: Schema.Types.ObjectId, ref: 'Users'}],
    logo: String,
    about_us: String
});

const seller = mongoose.model('Sellers', sellerSchema);

exports.registerSeller = (data) => {
    return seller.save(data);
};