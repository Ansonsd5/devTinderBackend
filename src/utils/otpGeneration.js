const crypto = require("crypto");
const OTP = require("../models/otp.js");
const sendEmail = require("../utils/sendEmail");

const generateAndSendOTP = async (user) => {
  const EXPIRESIN_MINUTES = 1;
  try {
    const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOtp = crypto.createHash("sha256").update(rawOtp).digest("hex");

    const otpRecord = await OTP.create({
      userId: user._id,
      otp: hashedOtp,
      otpExpires: Date.now() + EXPIRESIN_MINUTES * 60 * 1000,
    });

    if (!otpRecord) {
      throw new Error("Failed to save OTP in database");
    }

    const emailRes = await sendEmail.run(
      `🔐 Verify Your Email - OTP Code`,
      `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <tr>
        <td style="padding: 20px; text-align: center; background: #4a90e2; border-radius: 10px 10px 0 0; color: #fff;">
          <h2 style="margin: 0;">Email Verification</h2>
        </td>
      </tr>
      <tr>
        <td style="padding: 30px; color: #333;">
          <p style="font-size: 16px; margin: 0 0 15px;">Hello <b>${user.firstName}</b>,</p>
          <p style="font-size: 15px; margin: 0 0 20px;">
            Thank you for signing up! Please use the code below to verify your email address.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 28px; font-weight: bold; letter-spacing: 4px; padding: 12px 25px; background: #f3f6fb; border: 2px dashed #4a90e2; border-radius: 8px; display: inline-block; color: #4a90e2;">
              ${rawOtp}
            </span>
          </div>
          <p style="font-size: 14px; color: #666; margin: 0 0 10px;">
            ⏰ This code will expire in <b>${EXPIRESIN_MINUTES} minutes</b>.
          </p>
          <p style="font-size: 14px; color: #666; margin: 0;">
            If you didn’t request this, you can safely ignore this email.
          </p>
        </td>
      </tr>
      <tr>
        <td style="background: #f3f6fb; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #999;">
          © ${new Date().getFullYear()} DevTinder. All rights reserved.
        </td>
      </tr>
    </table>
  </div>
  `,
      user.emailId,
      "team@ansonsd.com"
    );
    console.log("emailRes", emailRes);

    return { success: true, message: "OTP generated and sent successfully",otpExpires:EXPIRESIN_MINUTES };
  } catch (error) {
    console.error("OTP generation error:", error.message);
    return { success: false, message: "Failed to generate and send OTP" };
  }
};

module.exports = { generateAndSendOTP };
