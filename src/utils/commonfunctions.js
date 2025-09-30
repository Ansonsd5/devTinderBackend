const OTP = require('../models/otp');

async function canSendOtp(userId) {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

 try {
  const otpCount = await OTP.countDocuments({
    userId: userId,
    createdAt: { $gte: startOfDay, $lte: endOfDay }
  });

  return otpCount < 3;
} catch (error) {
  console.error("Error while counting OTP documents:", error.message);

  return res.status(500).json({
    success: false,
    message: "Failed to count OTP records. Please try again later.",
    error: error.message,
  });
}
}

module.exports = { canSendOtp };