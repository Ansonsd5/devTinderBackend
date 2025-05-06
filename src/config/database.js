const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://anson:xlcQhDSdyLk9qUNs@namastedevtindercluster.icczbsm.mongodb.net/?retryWrites=true&w=majority&appName=NamasteDevTinderCluster"
  );
};

module.exports = connectDB;


