const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    const decodedMessage = await jwt.verify(token, "Token@123");
    if (decodedMessage) {
      // return decodedMessage
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
    res.status(404).send("ERROR :: " + error.message);
  }
};


module.exports ={
    userAuth,
}