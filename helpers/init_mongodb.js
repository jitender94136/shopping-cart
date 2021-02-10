const mongoose = require('mongoose');

let DB_NAME = '';
if (process.env.NODE_ENV === 'test') {
  DB_NAME = process.env.TEST_DB_NAME;
} else {
  DB_NAME = process.env.DB_NAME;
}

mongoose.connect(process.env.MONGODB_URI, {
  dbName: DB_NAME,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
  useCreateIndex: true,
}).then(() => {
  console.log('mongodb connected');
}).catch((err) => {
  console.log(err.message);
});

mongoose.connection.on('connected', () => {
  console.log('Mongoose Client Connected to DB');
});

mongoose.connection.on('disconnected', () => {
  console.log('mongoose client disconnected');
});

mongoose.connection.on('error', () => {
  console.log('There is an error in mongodb processing.');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('mongodb connection close');
  process.exit(0);
});
