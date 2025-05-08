const mongoose = require("mongoose");
require('dotenv').config();

const connectDB = async () => {
  await mongoose.connect(process.env.FUNNY_KEY_MOONGO);
};

module.exports = connectDB;


