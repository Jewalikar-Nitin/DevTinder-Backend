const express = require("express");
const app = express();
const { adminAuth, userAuth } = require("./middlewares/auth");
const connectDB = require("./config/database");
const User = require("./model/userModel");
const { signupValidator, updateUserValidator, loginValidator } = require("./utils/validate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");


connectDB()
  .then(() => {
    console.log("Connected DB successfully");
    app.listen(7777, () => {
      console.log("server listening on port 7777.");
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use(cookieParser());

//Sign up 
app.post("/signup", async (req, res) => {
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
app.post("/login",async (req,res)=>{
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

//Profile
app.get("/profile",async(req,res)=>{
  try{
    const token = req.cookies.token;
    if(!token){
      res.status(401).send("Unauthorized");
    }

    const decoded = await jwt.verify(token,'User@3421$');
    const {_id} = decoded;

    const user = await User.findOne({_id:_id});
    if(!user){
      res.status(404).send("User not found!!");
    }
    res.send(user);
  }catch(err){
    res.status(400).send("error"+err);
  }
})

// Get user by ID
app.get("/user/:id", async (req, res) => {
  try {
    let user = await User.findById(req.params?.id);
    res.send(user);
  } catch (err) {
    res.status(500).send("Internal server error!!");
  }
});

//get user by email
app.get("/user", async (req, res) => {
  try {
    const user = await User.findOne(req.body);
    res.send(user);
  } catch (err) {
    res.status(500).send("Internal server error");
  }
});

// get all users
app.get("/feed", async (req, res) => {
  try {
    let users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send("Internal server error!");
  }
});

//Update user
app.patch("/user/:userId", async (req, res) => {
  let id = req.params?.userId;
  let data = req.body;

  try {
    updateUserValidator(req);
    const user = await User.findByIdAndUpdate(id, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("User updated successfully!!");
  } catch (err) {
    res.status(500).send("Internal server error!" + err);
  }
});

//Delete user
app.delete("/user", async (req, res) => {
  try {
    let user = await User.findByIdAndDelete(req.body.id);
    res.send("User Deleted successfully!");
  } catch (err) {
    res.status(500).send("Internal server error");
  }
});
