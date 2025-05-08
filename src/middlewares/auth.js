const jwt = require("jsonwebtoken");
require('dotenv').config();
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const decodedMessage = await jwt.verify(token, process.env.JWT_SECRET);
    if (decodedMessage) {
      const { _id } = decodedMessage;
      const user = await User.findById(_id);
      if (user) {
        req.user = user;
        next();
      } else {
        throw new Error("Invalid token");
      }
    } else {
      throw new Error("Invalid token");
    }
  } catch (error) {
    res.status(401).send("ERROR :: " + error.message);
  }
};


module.exports ={
    userAuth,
}