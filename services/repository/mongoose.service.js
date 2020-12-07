const mongoose = require('mongoose');
let testConfig = require('../../shared/testConfig');
let config = require('../../shared/config');
let count = 0;
let env = process.env.NODE_ENV;
let dbURI = "";

if(env == 'test') {
    dbURI = testConfig.dbURI;
} else {
    dbURI = config.dbURI;
}

const options = {
    autoIndex: false,
    poolSize: 10,
    bufferMaxEntries: 0,
    useNewUrlParser: true,
    useUnifiedTopology: true
};

const connectWithRetry = () => {
    console.log('MongoDB connection with retry')
    mongoose.connect(dbURI, options).then(()=>{
        console.log('connected')
    }).catch(err=>{
        console.log('Connection unsuccessful, retrying after 5 seconds. ', ++count);
        setTimeout(connectWithRetry, 5000)
    })
};

connectWithRetry();

exports.mongoose = mongoose;
