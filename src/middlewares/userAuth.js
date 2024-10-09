const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req,res,next) =>{
    try{
        const {token} = req.cookies;
        if(!token)
        {
            throw new Error(" Token is not Valid");
        }

        const {_id} = jwt.verify(token, "0Vishnu!");

        const userData = await User.findById(_id);
        if(!userData)
        {
            throw new Error("User Data is not Found")
        }
        console.log("UD"+userData);
        req.user = userData;

        next();
    }
    catch(err)
    {
        res.status(400).send("ERROR : " + err.message);
    }
}

module.exports = {userAuth};