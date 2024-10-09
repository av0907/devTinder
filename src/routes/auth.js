const express = require("express");

const authRouter = express.Router();

const {dataValidation} = require("../utils/dataValidation.js")
const bcrypt = require('bcrypt');

const User = require("../models/user.js");


authRouter.post("/signup" ,async (req,res)=>{
    
    try{
        //First when i get the day then i have to check what all the data that the server got from req.body before storing it on the DB as this may contain malicious data.

        await dataValidation(req);


        //Now we have to encrypt the password before storing it in the DB

        const {firstName, lastName, email, gender, age, password, status} = req.body;

        const hashedPassword = await bcrypt.hash(password, 10)

        //The below line of code refers to creating a new instance of User Model
        const user = new User({
            firstName,
            lastName,
            email,
            age,
            gender,
            status,
            password: hashedPassword
        });

        await user.save();
        res.send("Inserted successfully");
    }
    catch(e)
    {
        res.status(400).send("Error saving the data to DB - "+e.message);
    }
    
})


authRouter.get("/login", async (req,res)=>{

    try{

        const {emailId, password} = req.body;

        const user = await User.findOne({email:emailId})

        //console.log("User : "+user)
        //console.log(user.password);

        if(!user)
        {
            throw new Error("Invalid Credentials. Please check again!")
        }
        //console.log("Password "+ password);
        //console.log("Encrypted Password : "+ user.password);
        const isAuthenticated = await user.validatePassword(password);

        if(isAuthenticated)
        {
            var token = user.getJWT();
            res.cookie("token", token)
            res.send("Login Successfull");
        }
        else{
            throw new Error("Invalid Credentials. Please check again!");
        }
    }catch(err)
    {
        res.send("Error : "+ err.message);
    }
} )

authRouter.get("/logout", (req,res)=>{
    res.cookie('token' ,null, {expires: new Date(Date.now())} );
    res.send("You are Logged Out!!");
})

module.exports=authRouter;