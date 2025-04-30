const express = require('express');
const { userAuth } = require('../middlewares/auth');

const requestRouter = express.Router();

requestRouter.post("/sendconnectionrequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (user) {
      res
        .status(201)
        .send(`${user?.firstName} send you the connection request`);
    } else {
      throw new Error("Please Login");
    }
  } catch (error) {
    res.status(500).send("ERROR :: " + error.message);
  }
});

module.exports = requestRouter;