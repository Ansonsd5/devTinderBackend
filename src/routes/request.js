const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

requestRouter.post("/request/:status/:toUserId", userAuth, async (req, res) => {
  let toUserName;
  
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    const fromUserName =req.user.firstName;

    const generateMsg = (status, fromUserName, toUserName) => {
      console.log(fromUserName, toUserName);
      
      switch (status) {
        case 'interested':
          return `${fromUserName} is ${status} in ${toUserName}`;
        case 'ignored':
          return `${fromUserName} ${status} ${toUserName}`;
        default:
          return `Request of ${status} sent`;
      }
    };
    

    const AllowedStatus = ["interested", "ignored"];
    if (!AllowedStatus.includes(status)) {
      throw new Error("Invalid status type " + status);
    }

    const isToUserExist = await User.findById({ _id: toUserId });

    if (!isToUserExist) {
      throw new Error("ERROR ::"+ error.message)
    }else{
      toUserName = isToUserExist.firstName;
    }

    const connectionExists = await ConnectionRequest.findOne({
      $or: [
        { fromUserId, toUserId },
        { fromUserId: toUserId, toUserId: fromUserId },
      ],
    });

    if (connectionExists) {
      // throw new Error("ERROR ::"+ error.message)
      res.status(500).json({ message: "Connection already exists" });
    }

    const connectionData = { fromUserId, toUserId, status };

    const connectionRequest = new ConnectionRequest(connectionData);

    const savedConnection = await connectionRequest.save();

    const userMessage = generateMsg(status,fromUserName,toUserName);


    res.status(201).json({
      message: userMessage,
      data: savedConnection,
    });
  } catch (error) {
    res.status(500).send("ERROR :: " + error.message);
  }
});

module.exports = requestRouter;
