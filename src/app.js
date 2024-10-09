const express = require("express");

const {connectDb} = require("./config/database");
const cookieParser = require("cookie-parser");
//var jwt = require("jsonwebtoken");
var {userAuth} = require("./middlewares/userAuth.js");

var authRouter = require("./routes/auth.js")
var profileRouter = require("./routes/profile.js")
var requestsRouter = require("./routes/requests.js");
const userRouter = require("./routes/user.js");

const app= express();



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
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestsRouter);
app.use("/", userRouter);