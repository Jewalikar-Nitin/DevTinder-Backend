const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../model/connectionRequestModel");
const User = require("../model/userModel");

const connnectionRouter = express.Router();

connnectionRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    const status = req.params.status;
    const toUserId = req.params.userId;
    const fromUserId = req.user._id;

    try {
      const toUserData = await User.findById(toUserId);
      if (!toUserData) throw new Error("User not found !!");
      
      const connectionRequestExist = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (connectionRequestExist) throw new Error(`already exist`);

      let user = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await user.save();

      res.send({ data: data, message: `${status} successfully` });
    } catch (err) {
      res.status(400).send("Error! " + err.message);
    }
  },
);

connnectionRouter.post("/request/review/:status/:requestID",userAuth,async(req,res)=>{
  try {
    const userId = req.user._id;
    const {status,requestID} = req.params;
    const allowedStatus = ["accepted","rejected"];

    if(!allowedStatus.includes(status)) throw new Error(`${status} status not allowed`);

    const connectionRequest = await ConnectionRequest.findOne({
      _id:requestID,
      toUserId:userId,
      status:"interested"
    }) 

    if(!connectionRequest) throw new Error ("Request not found");
    
    connectionRequest.status =status;
    const requestData = await connectionRequest.save(); 
    res.send(`Request ${status} successfully!!`);

  } catch (err) {
    res.status(400).send("Error "+err.message);
  }
})

module.exports = connnectionRouter;
