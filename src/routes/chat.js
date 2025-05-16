const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { Chat } = require('../models/chat');


const chatRouter = express.Router();

chatRouter.get('/getchat/:targetUserId',userAuth,async (req,res)=>{
    try {
    const userId = req.user._id;
    const {targetUserId} = req.params;


    let chat = await Chat.findOne({
        participants : {
            $all : [userId,targetUserId]
        }
    }).populate({
        path : "messages.senderId",
        select : "firstName"
    })

    if(!chat){
        chat = new Chat({
            participants :  [userId,targetUserId],
            messages :[]
        })

        await chat.save();
    res.status(200).json(chat);
    }
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({msg : error});
    }
})

module.exports = chatRouter;