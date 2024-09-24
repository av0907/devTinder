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

app.post("/signup" ,async (req,res)=>{

    const data = {
        firstName: "RK",
        lastName: "O",
    }

    const user = new User(data);

    try{
        await user.save();
        res.send("Inserted successfully");
    }
    catch(e)
    {
        res.status(400).send("Error saving the data to DB");
    }
    
})


