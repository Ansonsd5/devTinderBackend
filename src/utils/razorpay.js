const Razorpay = require("razorpay");
require('dotenv').config();

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
  headers: {
    "X-Razorpay-Account": "KV6Mvgm1UcPSNF"
  }
});

// instance.orders.all().then(console.log).catch(console.error);

module.exports = instance;