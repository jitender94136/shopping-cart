const mongoose = require('mongoose');
let count = 0;

const options = {
    autoIndex: false,
    poolSize: 10,
    bufferMaxEntries: 0,
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const connectWithRetry = () => {
    console.log('MongoDB connection with retry')
    mongoose.connect("mongodb://localhost:27017/shopping-cart", options).then(()=>{
        console.log('connected')
    }).catch(err=>{
        console.log('Connection unsuccessful, retrying after 5 seconds. ', ++count);
        setTimeout(connectWithRetry, 5000)
    })
};

connectWithRetry();

exports.mongoose = mongoose;
