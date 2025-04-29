const express = require("express");

const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData, validateLoginData } = require("./utils/validation");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  //Creating new instance of new user


  const { firstName, lastName, emailId, password } = req?.body;

  try {
    validateSignUpData(req.body);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
    });

    const savedData = await user.save();
    res.status(201).send(savedData);
  } catch (error) {
    res.status(501).send(`Error : ${error.message}`);
  }
  res.send("somthing went wrong");
});

app.get("/login", async (req, res) => {
  const { password, emailId } = req.body;

  try {
    validateLoginData(req?.body);
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isValidUser = await user.verifyPassword(password);

    if (isValidUser) {
      const token = await user.getJWT();

      res.cookie("token", token);
      res.status(200).send(user);
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(404).send(`Error :: ${error.message}`);
  }
});

app.get("/profile",userAuth, async (req, res) => {
  console.log("decodedMessage",req.user);
  try {
    const user = req.user;
    if(user){
      res.status(201).send(user)
    }else{
      throw new Error("Somthings is wrong with Auth");
    }
  } catch (error) {
    res.status(500).send("ERROR :: " + error.message);
  }
});

app.post("/sendconnectionrequest", userAuth, async (req, res) => {
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
