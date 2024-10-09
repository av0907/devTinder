const mongoose = require("mongoose");
const connectionRequestSchema = new mongoose.Schema({

    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User", //reference to the User collection
        required:true,
    },

    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["ignored","interested","rejected", "accepted"],
            message:`{VALUE} is not a valid status`
        }
    }

},
{timestamps:true});

connectionRequestSchema.index({fromUserId:1, toUserId:1});

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports=ConnectionRequest;