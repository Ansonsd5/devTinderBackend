const express = require("express");
const bcrypt = require("bcrypt");

const { validateSignUpData, validateLoginData } = require("../utils/validation");
const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  //Creating new instance of new user

  const { firstName, lastName, emailId, password } = req?.body;
  const USER_SAFE_DATA = "firstName age gender skills photoUrl about";

  try {
    validateSignUpData(req.body);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    }).populate(USER_SAFE_DATA);

    const savedData = await user.save();
    res.status(201).json(savedData);
  } catch (error) {
    if (error.code === 11000) {
      throw new Error('❌ Duplicate email found.');
    }
    res.status(501).send(`Error : ${error.message}`);
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
 