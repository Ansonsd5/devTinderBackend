const express = require("express");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const { validateProfileEditData, validatePassword } = require("../utils/validation");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (user) {
      res.status(201).send(user);
    } else {
      res.status(401).send("Please login");
    }
  } catch (error) {
    
    res.status(500).send("ERROR :: " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  const loggedInUser = req.user;
  const userInputData = req.body;

  try {
    if (!validateProfileEditData(userInputData)) {
      throw new Error("Invalid edit request");
    }

    Object.keys(userInputData).forEach((field) => {
      loggedInUser[field] = userInputData[field];
    });

    await loggedInUser.save();

    res
      .status(200)
      .json({
        message: `${loggedInUser.firstName} your profile has been updated`,
        data: loggedInUser,
        status :201,
      });
  } catch (error) {
    res.status(500).send("ERROR :: " + error.message);
  }
});

profileRouter.patch("/profile/changepassword", userAuth, async (req, res) => {
  const loggedInUser = req.user;
  const newPassword = req.body.password;

  try {
    if (!validatePassword(newPassword)) {
      throw new Error("Invalid new password");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    loggedInUser.password = hashedPassword;

    await loggedInUser.save();

    res
      .status(201)
      .json({ message: "Password changed successfully", status: 200 });
  } catch (error) {
    res.status(500).send("ERROR :: " + error.message);
  }
});

module.exports = profileRouter;
