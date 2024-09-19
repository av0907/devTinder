const express = require("express");

const app= express();

app.listen(3000,()=>{
    console.log("Aditya Vishnu's first Express Server")
});

app.use("/home",(req,res)=>{
    res.send("Home Page")
})

app.use("/first/one",(req,res)=>{
    res.send("First One Page");
})

app.use("/first",(req,res)=>{
    res.send("First Page");
})

app.use("/second",(req,res)=>{
    res.send("Second Page");
})

app.use("/third",(req,res)=>{
    res.send("Third Page");
})