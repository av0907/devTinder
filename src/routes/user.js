const express = require("express");
const { userAuth } = require("../middlewares/userAuth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();


userRouter.get("/user/requests/received", userAuth, async (req, res)=>{
    try{

        const loggedInUserId = req.user._id;

        const receivedConnectionRequests = await ConnectionRequest.find({
            toUserId:loggedInUserId,
            status:"interested",
        }).populate("fromUserId", "firstName lastName, gender, status")
        res.json({"data": receivedConnectionRequests});
    }
    catch(err)
    {
        res.send(" ERROR : "+ err.message);
    }
})

userRouter.get("/user/connections", userAuth, async (req,res)=>{

    try{

        const loggedInUserId = req.user._id;
        const userConnections = await ConnectionRequest.find(
            { $or: [{toUserId:loggedInUserId, status:"accepted"},
                {fromUserId:loggedInUserId, status:"accepted"}
            ]
            }).populate("fromUserId", "firstName email status").populate("toUserId" , "firstName email status")

        const acceptedConnections = userConnections.map(user=> 
            {
                if(user.fromUserId._id.toString() === loggedInUserId.toString())
                {
                    return user.toUserId;
                }
                return user.fromUserId;
            }
        )

        res.status(200).json({data: acceptedConnections})
    }
    catch(err)
    {
        res.status(400).send("Error : "+ err.message);
    }
})

/*userRouter.get("/user/feed", userAuth, async (req, res)=>{

    try{
        
        const page = parseInt(req.params.page);

        const limit = parseInt(req.params.limt);



        const loggedInUserId = req.user._id;

        const allUsers = await User.find({});

        const allUsersExceptLoggedInUser = allUsers.filter(user => user._id.toString()!==loggedInUserId.toString());

        //console.log(allUsersExceptLoggedInUser);

        const promises = allUsersExceptLoggedInUser.map(async (user)=>{
            //let results=[];
            const entry = await ConnectionRequest.findOne(
                {$or:[{fromUserId: loggedInUserId, toUserId: user._id},
                    { fromUserId:user._id, toUserId: loggedInUserId, status:"accepted"},
                    { fromUserId:user._id, toUserId: loggedInUserId, status:"rejected"} ]})

            return entry? null: user;
        });

        console.log(promises);
        
        const finalUsersWithNoRelation = (await Promise.all(promises)).filter(user => user !== null);

        // Now send the actual list of users with no relation
        res.json(finalUsersWithNoRelation);

        //res.send("You got all the users");
    }
    catch(err)
    {
        res.send("ERRor")
    }

})*/


userRouter.get("/user/feed", userAuth, async (req, res)=>{

    let skip = parseInt(req.query.skip)||1;

    const limit = parseInt(req.query.limit) ||10;

    skip = (skip-1)*limit;

    const loggedInUserId = req.user._id;

    const allConnectionsLoggedInUserSent = await ConnectionRequest.find({fromUserId:loggedInUserId});

    const connectionsIds = allConnectionsLoggedInUserSent.map(user=> user.toUserId);

    console.log(connectionsIds);

    const usersWithNoRelation = await User.find({$and:[{_id:{$nin: connectionsIds}}, {_id:{$ne:loggedInUserId}}]}).select("firstName lastName status").skip(skip).limit(limit);

    console.log("Userswithnorelation"+usersWithNoRelation);

    res.send(usersWithNoRelation);
})

module.exports=userRouter;

