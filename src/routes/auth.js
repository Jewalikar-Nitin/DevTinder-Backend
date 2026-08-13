const express = require("express");
const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const { signupValidator, loginValidator } = require("../utils/validate");

const authRouter = express.Router();

//Sign up 
authRouter.post("/signup", async (req, res) => {
  try {
    signupValidator(req);
    const { firstName, lastName, emailID, password, gender } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailID,
      password: hashedPassword,
      gender
    });
    await user.save();
    res.send("User saved successfully");
  } catch (err) {
    res.status(500).send("Internal server error!!" + err);
  }
});

//Login 
authRouter.post("/login",async (req,res)=>{
  try {
    loginValidator(req);
    const {emailID, password} = req.body;
    const user = await User.findOne({emailID:emailID});
        
    if(!user){
      throw new Error("Invalid credentials");
    }
    const isValidPassword = await user.validatePassword(password);

    if(!isValidPassword) {
      throw new Error("Invalid credentials");
    }
    const token = await user.getJWT();
    res.cookie('token',token,{expires:new Date(Date.now() + 8 * 3600000)});
    res.send("Login successful!!");

  } catch (err) {
    res.status(400).send("error"+err);
  }
})

//Logout
authRouter.post("/logout",async(req,res)=>{
    res.cookie('token',null,{expires:new Date(Date.now())});
    res.send();
})

module.exports = authRouter;