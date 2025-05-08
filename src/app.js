const express = require("express");
require('dotenv').config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const app = express();

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use(cors({
  origin : "http://localhost:5173",
  credentials :true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);


connectDB()
  .then(() => {
    console.log("Data base connected to DataBase ");
    app.listen(process.env.PORT, () => {
      console.log(`App listening at ${process.env.PORT}`);
    });
  })
  .catch(() => {
    console.log("Failed to connect to dataBase");
  });

// app.use('/route',"RH1",["RH2","RH3"],"RH4") valid
