const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.ObjectId,
        required:true
    },
    toUserId:{
        type:mongoose.ObjectId,
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:["interested","ignored","accepted","rejected"],
            message:`{VALUE} is incorrect status type`
        }
    }
},{timestamps:true});

connectionRequestSchema.index({fromUserId:1,toUserId:1});

connectionRequestSchema.pre('save',function(next){
    let newRequest = this;
    if(newRequest.fromUserId.equals(newRequest.toUserId)){
        throw new Error("You can not send request to yourself!")
    }
})

ConnectionRequest = mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports = ConnectionRequest;