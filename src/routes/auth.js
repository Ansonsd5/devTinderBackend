const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const {
  validateSignUpData,
  validateLoginData,
  validateOtpData,
} = require("../utils/validation");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const { generateAndSendOTP } = require("../utils/otpGeneration");
const OTP = require("../models/otp");
const { canSendOtp } = require("../utils/commonfunctions");
const authRouter = express.Router();




authRouter.post("/signup", async (req, res) => {
  const { firstName, lastName, emailId, password, resend } = req?.body;

  try {
    validateSignUpData(req.body);

    const hashedPassword = await bcrypt.hash(password, 10);

    if (resend) {
      const user = await User.findOne({ emailId });
     
      
      const allowed = await canSendOtp(user._id);
      if (!allowed) {
        return res
          .status(429)
          .json({ message: "OTP limit reached. Try again tomorrow." });
      }

      if (!user.isVerified) {
        const result = await generateAndSendOTP(user);

        if (!result) {
          return res.status(500).json({
            message: "Failed to send OTP. Please try again later.",
          });
        }

        if (result) {
          return res.status(201).json({
            message:
              "A new OTP has been sent to your email. Please verify it to complete signup.",
            userId: user._id,
            otpExpires: result.otpExpires,
          });
        }
      }
    }

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });

    const savedUser = await user.save();

    const result = await generateAndSendOTP(user);
    if (savedUser) {
      if (result) {
        res
          .status(201)
          .json({
            message: "Sign Up successfull!!! Please verify the email otp",
            userId: user.id,
            otpExpires: result.otpExpires,
          });
      }
    }
  } catch (error) {
    if (error.code === 11000) {
      throw new Error("❌ Duplicate email found.");
    }
    res.status(501).send(`Error : ${error.message}`);
  }
});

authRouter.post("/verify-mail", async (req, res) => {
  const { userId, otp } = req.body;

  try {
    validateOtpData(otp);

    const otpRecord = await OTP.findOne({ userId });
    if (!otpRecord) {
      return res
        .status(400)
        .json({ message: "No OTP request found or it has expired" });
    }

    if (otpRecord.otpExpires < Date.now()) {
      // await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ message: "OTP has expired" });
    }

    const hashedInput = crypto.createHash("sha256").update(otp).digest("hex");
    if (hashedInput !== otpRecord.otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isVerified: true },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // await OTP.deleteOne({ _id: otpRecord._id });

    if (updatedUser && updatedUser.isVerified) {
      const token = await updatedUser.getJWT();
      res.cookie("token", token);
      console.log("updatedUser", updatedUser);
      return res.status(200).json({
        status: 200,
        message: "OTP verified successfully!",
        user: updatedUser,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: `Error :: ${error.message}` });
  }
});

authRouter.post("/login", async (req, res) => {
  const { password, emailId } = req.body;

  try {
    validateLoginData(req?.body);
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }
    if(!user.isVerified){   
    }

    const isValidUser = await user.verifyPassword(password);

    if (isValidUser) {
      const token = await user.getJWT();

      res.cookie("token", token);
      res.status(200).send(user);
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(404).send(`Error :: ${error.message}`);
  }
});

authRouter.post("/logout", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("You are not Loggedin");
    } else {
      res.clearCookie("token");
      res.status(200).send("Loggedout successfully");
    }
  } catch (error) {
    res.status(500).send("ERROR :: " + error.message);
  }
});

module.exports = authRouter;
