const express = require("express");

const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const app = express();

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);


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
