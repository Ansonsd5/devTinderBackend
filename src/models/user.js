const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        minLength :4,
        maxLength:40,

    },
    lastName : {
        type :String,
        maxLength:40,
    },
    emailId : {
        type :String,
        lowerCase : true,
        required : true,
        unique : true,
        trim : true,
        maxLength:60,

    },
    password : {
        type : String,
        required : true,
    },
    age : {
        type : Number,
        maxLength:3,
    },
    gender : {
        type : String,
        lowerCase : true,
        validate(value){
            if(!['male','female','others'].includes(value)){
                throw new Error("Invalid gender input");
            }
        }
    },
    photoUrl : {
        type :String,

    },
    about : {
        type : String,
        default : "This is the default description of user",
        maxLength:80,

    },
    skills : {
        type : [String]
    }
},{timestamps :true});

const UserModel = mongoose.model("User",userSchema);

module.exports = UserModel;