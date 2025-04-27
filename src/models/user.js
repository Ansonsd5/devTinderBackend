const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        minLength :4

    },
    lastName : {
        type :String,
    },
    emailId : {
        type :String,
        lowerCase : true,
        required : true,
        unique : true,
        trim : true,

    },
    password : {
        type : String,
        required : true,
    },
    age : {
        type : Number,
    },
    gender : {
        type : String,
    },
    photoUrl : {
        type :String,

    },
    about : {
        type : String,
        default : "This is the default description of user"
    },
    skills : {
        type : [String]
    }
});

const UserModel = mongoose.model("User",userSchema);

module.exports = UserModel;