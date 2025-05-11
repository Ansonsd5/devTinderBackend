const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require("bcrypt");
const mongoose = require('mongoose');
const validator = require('validator');
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 4,
      maxLength: 40,
    },
    lastName: {
      type: String,
      maxLength: 40,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      maxLength: 60,
      background : true ,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Enter a valid email " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      maxLength: 3,
      validate(value){
        if(value.length > this.maxlength){
          throw new Error("Invalid age input");
        }
      }
    },
    gender: {
      type: String,
      lowerCase: true,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Invalid gender input");
        }
      },
    },
    photoUrl: {
      type: String,
      default :"https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Enter a valid photo url " + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is the default description of user",
    },
    skills: {
      type: [String],
      validate(value) {
        if (value.length > 5) {
          throw new Error("Add only top 5 skills");
        }
      },
    },
    isPremium : {
      type: Boolean,
      default :false,
    },
    membershipType : {
      type : String,
      default :"basic",
    }
    
  },
  { timestamps: true }
);


userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

userSchema.methods.verifyPassword = async function (userInputPass) {
  const user = this;
  const DBPassword =user.password;
  const isValidUser = await bcrypt.compare(userInputPass, DBPassword);
  return isValidUser;
};

// userSchema.pre('save', async function (next) {
//   const existing = await mongoose.models.User.findOne({ emailId: this.emailId });
//   if (existing) {
//     return next(new Error('Email already exists!'));
//   }
//   next();
// });




const UserModel = mongoose.model("User",userSchema);

module.exports = UserModel;