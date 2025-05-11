const cron = require("node-cron");
const ConnectionRequest = require("../models/connectionRequest");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require('../utils/sendEmail');


//Run this job everyday at 9am
cron.schedule("0 9 * * *", async () => {
  const yesterday = subDays(new Date(), 1);
  const start = startOfDay(yesterday);
  const end = endOfDay(yesterday);

  console.log(yesterday);
  try {
    const pendingConnectionRequestOfYesterday = await ConnectionRequest.find({
      status: "interested",
      createdAt: {
        $gt: start,
        $lt: end,
      },
    }).populate("fromUserId toUserId");

    const emailList = [...new Set(pendingConnectionRequestOfYesterday.map((connection)=>connection.toUserId.emailId))];

    if(emailList){
        for(const email in emailList){
            try {
                const res = await sendEmail.run("New connection request from "+email,"There are many pending request waiting for you. Please login to DevTinder and review them all",email)
                console.log("email res",res)
            } catch (error) {
               console.log("Email of List"+error); 
            }
        }
    }else{
        console.log("No email to send request",emailList)
    }

    
  } catch (error) {
    console.log("ERROR AT CORN :: " + error);
  }
});
