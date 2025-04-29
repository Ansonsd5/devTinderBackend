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
      lowerCase: true,
      required: true,
      unique: true,
      trim: true,
      maxLength: 60,
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
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Enter a valid email " + value);
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
        console.log("value", value);
        if (value.length > 5) {
          throw new Error("Add only top 5 skills");
        }
      },
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("User",userSchema);

module.exports = UserModel;