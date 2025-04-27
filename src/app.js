const express = require("express");
const connectDB = require("./config/database");
const app = express();

const User = require('./models/user');

app.post('/signup',async (req,res)=>{
 const userObj = {
  firstName : "Anson",
  lastName : "Dsouza",
  email : "anson11sd@gmail.com",
  password : "Anson",

 }

 //Creating new instance of new user
const user = new User(userObj);

 await user.save();
 console.log("Data saved to DB ")
})

connectDB()
  .then(() => {
    console.log("Data base connected to DataBase ");
    app.listen(7777, () => {
      console.log("App listening at 7777");
    });
  })
  .catch(() => {
    console.log("Failed to connect to dataBase");
  });
// app.use('/route',"RH1",["RH2","RH3"],"RH4") valid
