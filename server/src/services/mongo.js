const mongoose = require('mongoose');

// const MONGO_URL =
// 'mongodb+srv://nasa-api:kY3iR5uRbKHLxAfg@nasacluster.lxidoi5.mongodb.net/nasa?retryWrites=true&w=majority';
const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once('open', () => {
  console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', err => {
  console.log(err);
});

async function mongoConnect() {
  await mongoose.connect(
    MONGO_URL /*, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifinedTopology: true,
  }*/
  );
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
