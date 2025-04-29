const express = require("express");
const bcrypt = require("bcrypt");
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

app.get("/login", async (req, res) => {
  const { password, emailId } = req.body;
 
  try {
    validateLoginData(req?.body);
    const userDeatilsFromDB = await User.findOne({ emailId: emailId });
    if (!userDeatilsFromDB) {
      throw new Error("Invalid Credentials");
    }

    const DBStroredPassword = userDeatilsFromDB?.password;

    const isValidUser = await bcrypt.compare(password, DBStroredPassword);

    if (isValidUser) {
      const token = await jwt.sign({ _id: userDeatilsFromDB._id }, "Token@123");

      res.cookie("token", token);
      res.status(200).send(userDeatilsFromDB);
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

app.get("/getsingleuser", async (req, res) => {
  const email = req.body.emailId;
  try {
    const user = await User.findOne({ emailId: email });
    if (!user) {
      res.status(404).send("Not found");
    } else {
      res.status(200).send(user);
    }
  } catch (error) {
    res.status(404).send("No match found");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const allUserInDB = await User.find({});
    if (allUserInDB.length) {
      res.status(200).send(allUserInDB);
    } else {
      res.status(404).send("No feed found");
    }
  } catch (error) {
    res.status(500).send("No user found");
  }
});

app.delete("/delete", async (req, res) => {
  try {
    const userId = req.body._id;
    await User.findByIdAndDelete(userId);
    res.status(200).send(`User with id-${userId} deleted Successfully`);
  } catch (error) {
    res.status(500).send(`Failed to delete user`);
  }
});

app.patch("/update/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_FIELDS = ["password", "age", "about", "skills"];
    const isAllowedUpdate = Object.keys(data).every((key) =>
      ALLOWED_FIELDS.includes(key)
    );

    if (!isAllowedUpdate) {
      throw new Error("Update not Allowed");
    }

    const updatedUser = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    if (updatedUser) {
      res.status(201).send(updatedUser);
    } else {
      res.status(500).send("Failed to update");
    }
  } catch (error) {
    res.send("ERROR ::" + error.message);
  }
});

app.patch("/updatebyemail", async (req, res) => {
  const email = req.body.emailId;
  let newData = req.body;
  try {
    const updatedUser = await User.findOneAndUpdate(
      { emailId: email },
      newData,
      { returnDocument: "after", runValidators: true }
    );
    res.status(201).send(updatedUser);
  } catch (error) {
    res.status(500).send(`ERROR :: ${error.message}`);
  }
  res.send("Somthing went wrong");
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
