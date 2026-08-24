const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../model/connectionRequestModel");
const User = require("../model/userModel");

const userRouter = express.Router();

const USER_SAFE_DATA = ["firstName", "lastName", "skills", "photoURL", "about"];

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA).select("fromUserId");

    res.json({
      message: "ok",
      data: requests,
    });
  } catch (err) {
    res.status(400).json({ message: "Error" + err.message });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connections = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connections.map((connection) => {
      if (connection.fromUserId._id.equals(loggedInUser._id)) {
        return connection.toUserId;
      }
      return connection.fromUserId;
    });
    res.send({ message: "Success", data: data });
  } catch (err) {
    res.status(400).send({ message: "Error! " + err.message });
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const page = (req.query.page) || 1;
    let limit = (req.query.limit) || 10;
    limit = limit > 50 ? 50 :limit;
    const skip = (page-1)*limit;


    const logggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: logggedInUser._id }, { toUserId: logggedInUser._id }],
    }).select(["fromUserId", "toUserId"]);

    const hideUserFromFeed = new Set();

    connectionRequests.forEach((element) => {
      hideUserFromFeed.add(element.fromUserId.toString());
      hideUserFromFeed.add(element.toUserId.toString());
    });

    const feedData = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        { _id: { $ne: logggedInUser._id } },
      ],
    }).select(USER_SAFE_DATA).skip(skip).limit(limit);

    res.send(feedData);
  } catch (err) {
    res.status(400).send("Error! " + err.message);
  }
});

module.exports = userRouter;
