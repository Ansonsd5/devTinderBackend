const express = require("express");
const connectDB = require("./config/database");
const app = express();

const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  //  const userObj = {
  //   firstName : "Anson",
  //   lastName : "Dsouza",
  //   emailId : "ansosn11sd@gmail.com",
  //   password : "Ansons",

  //  }

  //Creating new instance of new user

  console.log("req boday", req.body);
  const user = new User(req.body);

  try {
    const savedData = await user.save();
    res.status(201).send(savedData);
  } catch (error) {
    res.status(501).send("Something went wrong");
  }
  
});

app.get("/getuser", async (req, res) => {
  try {
    const userDataFromDB = await User.find({ emailId: req.body.emailId });
    if (userDataFromDB.length) {
      res.send(userDataFromDB);
    } else {
      res.status(404).send("No match found");
    }
  } catch (error) {
    res.send("Could not find the User");
  }
});

app.get("/getsingleuser",async(req,res)=>{
  const email = req.body.emailId;
  try {
    const user =await User.findOne({emailId : email});
    if(!user){
      res.status(404).send("Not found")
    }else{
      res.status(200).send(user);
    }
    
  } catch (error) {
    res.status(404).send("No match found");
  }
})

app.get("/feed",async (req,res)=>{
  try {
    const allUserInDB = await User.find({});
    if(allUserInDB.length){
      res.status(200).send(allUserInDB);
    }else{
      res.status(404).send("No feed found")
    }
  } catch (error) {
    res.status(500).send("No user found");
  }
})

app.delete('/delete', async (req,res)=>{
  try {
    const userId = req.body._id;
    await User.findByIdAndDelete(userId);
    res.status(200).send(`User with id-${userId} deleted Successfully`)
  } catch (error) {
    res.status(500).send(`Failed to delete user`);
  }
})

app.patch('/update',async (req,res)=>{
  const userId = req.body.userId;
  const data = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(userId,data,{returnDocument :'after'});
    if(updatedUser){
      res.status(201).send(updatedUser);
    }else{
      res.status(500).send("Failed to update");
    }
  } catch (error) {
    res.send("Something is wrong")
  }
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
