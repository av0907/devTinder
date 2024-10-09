const express = require("express");

const {userAuth} = require("../middlewares/userAuth")
const User = require("../models/user");
const {profileDataValidation} = require("../utils/dataValidation")

const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get("/profile/view" , userAuth  , async (req,res)=>{

    try{
        const user = req.user;
        res.send(user)
    }
    catch(err)
    {
        res.status(400).send("ERROR :" + err.message);
    }

})

profileRouter.patch("/profile/edit",userAuth, (req,res)=>{
    const isAllKeysEditable = profileDataValidation(req.body);
    try{
        if(!isAllKeysEditable)
            {
                throw new Error("Please Update only the valid data");
            }

            const loggedInUser = req.user;
            console.log("LoggedinUser", loggedInUser)
            Object.keys(req.body).forEach(key =>
                loggedInUser[key] = req.body[key]
            );
            loggedInUser.save();
            console.log(loggedInUser);
            res.send("Updated!!");
    }
    catch(err)
    {
        res.send("ERROR : "+ err.message);
    }
   
})

profileRouter.patch("/profile/edit/password", userAuth, async (req,res)=>{
    try{
        const {presentPassword, newPassword, confirmNewPassword} = req.body;
        const loggedInUser = req.user;
        console.log(loggedInUser.password);
        const isPasswordMatched = await bcrypt.compare(presentPassword, loggedInUser.password);
        console.log("IispasswordMatched", isPasswordMatched);
        //const isNewPasswordSameAsBefore = await bcrypt.compare(presentPassword, newPassword);
        const isNewPasswordSameAsBefore = presentPassword === newPassword
        console.log("isNewPasswordSameAsBefore - ", isNewPasswordSameAsBefore);

        if(!isPasswordMatched)
        {
            throw new Error("Your present password is not verified")
        }

        if( newPassword !== confirmNewPassword)
        {
            throw new Error("Your new passwords didn't match")
        }
        if(isNewPasswordSameAsBefore)
        {
            throw new Error("Your password cant be same as before password")
        }

        const hasedPassword = await bcrypt.hash(newPassword,10);

        loggedInUser.password = hasedPassword;
        loggedInUser.save();
        res.send("Password Updated successfully")
    }
    catch(err)
    {
        res.send("ERROR : "+ err.message);
    }

})

module.exports = profileRouter;