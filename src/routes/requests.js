const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const ConnectionRequest = require("../models/connectionRequest")
const User = require("../models/user")
const mongoose = require("mongoose")

const requestsRouter = express.Router();


requestsRouter.post("/request/send/:status/:toUserId", userAuth, async (req,res)=>{

    try{
        const status = req.params.status;
        const toUserId = req.params.toUserId;
        const fromUserId = req.user._id;

        const allowedStatus = ["ignored", "interested"];

        if(!allowedStatus.includes(status))
        {
            throw new Error("Requested Status is Invalid");
        }

        const toUserData = await User.findById(toUserId);

        if(!toUserData)
        {
            throw new Error("User not Found!!");
        }

        if(fromUserId.equals(toUserId))
        {
            throw new Error("You can't send request to yourself");
        }


        const existingConnectionRequest = await ConnectionRequest.findOne({
           $or:[  {fromUserId, toUserId}, {fromUserId:toUserId, toUserId:fromUserId} ]
        })

        if(existingConnectionRequest)
        {
            throw new Error(" Connection request already sent!")
        }


        const connectionRequestData = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequestData.save();
        res.json(data);
    }
    catch(err)
    {
        res.send("ERROR : "+err.message);
    }


})

//The below Api is for the loggedinuser to accept or reject the Requests he/she got.
requestsRouter.post("/request/review/:status/:requestId", userAuth, async (req,res) =>{

    try{

        const status = req.params.status;
        const requestId = req.params.requestId;
        const loggedInUserId = req.user._id;

        const acceptedStatus = ["accepted" , "rejected"];
        if(!acceptedStatus.includes(status))
        {
            throw new Error("Invalid status!!")
        }
        const requestData  = await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:loggedInUserId,
            status:"interested"
        });
        console.log("Request Data " + requestData);

        if(!requestData)
        {
            throw new Error("Request not Found in DB")
        }
        const toUserId = requestData.toUserId;
        if( !toUserId.equals(loggedInUserId))
        {
            throw new Error("User not loggedIn");
        }
        requestData.status = status;
        requestData.save();
        res.send("Request "+ status);
    }
    catch(err)
    {
        res.status(400).send("ERROR : "+ err.message);
    }

} )


module.exports= requestsRouter;