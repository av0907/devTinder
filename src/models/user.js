const mongoose = require('mongoose');
var validator = require('validator');
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName: { type : String,required:true, validate(value){if(!validator.isAlpha(value, "en-US" ,{ignore: " "})) { throw new Error("Name should contain only Alphabets ")} }},
    lastName: {type: String},
    email: {type: String, required:true, unique:true, validate(value){ if (!validator.isEmail(value)){throw new Error("EmailId is not valid")}}},
    password:{type:String, required:true,trim:true },
    age:{type: Number, min:18},
    gender:{type:String, lowercase:true, validate(value){ if(!["male", "female", "other"].includes(value)){ throw new Error("Not a Valid Gender!!")
     }}},
     status:{
        type:String,
        default:"Hey there I am using this Appliation!!"
     }
},
{timestamps:true})

//We should not use arrow methods while writing schema methods.
userSchema.methods.validatePassword = function (userProvidedPassword)
{

   const isValidated = bcrypt.compare(userProvidedPassword, this.password)

   return isValidated;
}

userSchema.methods.getJWT = function ()
{
   const user  = this;

   const token = jwt.sign({_id:user._id}, "0Vishnu!");

   return token;
}
const User = mongoose.model("User", userSchema);

module.exports = User;