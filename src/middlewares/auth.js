const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).send("Unauthorize!");
    }
    const decoded = await jwt.verify(token, "User@3421$");
    const { _id } = decoded;

    const user = await User.findOne({ _id: _id });
    if (!user) {
      return res.status(404).send("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    res.send("Error! " + err.message);
  }
};

module.exports = { userAuth };
