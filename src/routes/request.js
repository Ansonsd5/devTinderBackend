const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const requestRouter = express.Router();

const sendEmail = require('../utils/sendEmail');

requestRouter.post("/request/:status/:toUserId", userAuth, async (req, res) => {
  let toUserName;
  
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;
    const fromUserName =req.user.firstName;

    const generateMsg = (status, fromUserName, toUserName) => {
      
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
      throw new Error("User not found Exist");
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

     const emailRes = await sendEmail.run(
        "A new friend request from " + fromUserName,
        fromUserName + " is " + status + " in " + toUserName
      );
      console.log("emailRes",emailRes);

    res.status(201).json({
      message: userMessage,
      data: savedConnection,
    });
  } catch (error) {
    res.status(500).send("ERROR :: " + error.message);
  }
});

requestRouter.post("/request/review/:status/:requestId", userAuth, async (req,res) => {
  try {
    const {status,requestId} = req.params;
    const loggedInUser = req.user;
  

    const allowedStatus = ['accepted', 'rejected'];

    if (!allowedStatus.includes(status)) {
      res.status(400).json({ message: "Status not allowed" });
    }

    const connectRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId : loggedInUser._id,
      status : 'interested'
    });


    if(!connectRequest){
      res.status(404).json("Connection request not found");
    }

    connectRequest.status = status;

    const data = await connectRequest.save();

    res.status(200).json({
      message : "Connection accepted successfulluy",
      data : data 
    })






  } catch (error) {
    res.status(500).json({
      message : "Cannot review the request at the moment"
    })
  }
})

module.exports = requestRouter;
