const mongoose = require('mongoose');


const connectDb = async() =>{

    //mongoose.connect is a function which is used to connect to  the MongoDB and this returns a promise whether the connection is success or failure so we keep this inside a async function.
    await mongoose.connect(
        //The below URL is used to connect to the Mongodb cluster
        "mongodb+srv://Node1:1q2w3e@namastenode.wpi0l.mongodb.net/devTinder"
    );
    return 200;
}


module.exports = {connectDb};