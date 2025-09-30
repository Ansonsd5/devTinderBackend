const mongoose = require('mongoose');
const otpSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  otp: String,      
  otpExpires: Date,
}, { timestamps: true });

const otpModel = mongoose.model("Otp",otpSchema);

module.exports =otpModel;