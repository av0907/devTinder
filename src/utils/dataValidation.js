
const validator = require("validator");
const User = require("../models/user")

const dataValidation = async (data)=>{

    const {firstName, lastName, age, gender, email, status, password} = data.body;

    const isUserAlreadyExist = await User.findOne({email:email});
    console.log("Existing User"+isUserAlreadyExist);
    if(isUserAlreadyExist)
    {
         throw new Error("User Already exist.")
    }
    else if (!firstName)
    {
        throw new Error("First Name is required!! Function")
    }
    else if(age<18)
    {
        throw new Error("Age should be 18 or more!! Function")
    }
    else if(gender && !["male", "female", "others"].includes(gender.toLowerCase()))
    {
        throw new Error("Gender is not Valid! Function")
    }
    else if(status && status.length>50)
    {
        throw new Error("Number of characters in the status should not be more than 50!! Function")
    }
    else{
        if(!validator.isEmail(email))
        {
            throw new Error("Provided EmailId is not Valid!! Function")
        }
    }
}

const profileDataValidation = (data)=>{
    const editableFields = ["firstName", "lastName", "age", "status", "gender"];
    const isAllKeysEditable = Object.keys(data).every(key=> editableFields.includes(key) );
    return isAllKeysEditable;
}


module.exports={
    dataValidation,
    profileDataValidation
};