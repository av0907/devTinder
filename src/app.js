const express = require("express");

const {connectDb} = require("./config/database");

const app= express();

const User = require("./models/user");

connectDb().then(
    (data)=>{
        console.log("DB Connection Successfull" + data);
        app.listen(3000,(req,res)=>{
            console.log("Express server is listening");
        })
    }
)
.catch(
    ()=>{
        console.error("DB connection failed!!");
    }
)

app.use(express.json());

app.post("/signup" ,async (req,res)=>{

    //The below line of code refers to creating a new instance of User Model
    const user = new User(req.body);
    
    try{
        await user.save();
        res.send("Inserted successfully");
    }
    catch(e)
    {
        res.status(400).send("Error saving the data to DB");
    }
    
})


app.get("/feed", async (req,res)=>{

    const user = await User.find({});
    if(user.length===0)
    {
        res.status(404).send("Users not found");
    }
    else{
        res.send(user);
    }
})

app.get("/user", async (req,res)=>{
    try{
       const returnedUser =  await User.findOne({firstName : req.body.fName})
       res.status(200).send(returnedUser);
    }
    catch(err)
    {
        res.status(404).send("User Not Found");
    }
})
