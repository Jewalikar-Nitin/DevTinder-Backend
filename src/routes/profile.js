const { userAuth } = require("../middlewares/auth");
const express = require("express");
const { profileUpdateValidator, updatePasswordValidator } = require("../utils/validate");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

//Profile view
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("error" + err.message);
  }
});

profileRouter.patch("/profile/update", userAuth, async (req, res) => {
  try {
    if(!profileUpdateValidator(req)){
      throw new Error ("Invalid Edit data");
    }
    let loggedInUser = req.user;
    let data = req.body;

    Object.keys(data).forEach((element) => {
      loggedInUser[element] = data[element];
    });
    await loggedInUser.save();

    res.json({ message: "User updated successfully", data: loggedInUser });
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});

profileRouter.patch("/profile/password",userAuth,async(req,res)=>{
  try {
    updatePasswordValidator(req);
    const loggedInUser = req.user;

    const isValidPassword = await bcrypt.compare(req.body.password, loggedInUser.password);  
    if(!isValidPassword){
      throw new Error("Invalid password");
    }  
    const hashedPassword = await bcrypt.hash(req.body.newPassword,10);
    loggedInUser['password'] = hashedPassword;

    await loggedInUser.save();

    res.send("Password updated successfully");
    
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
})

module.exports = profileRouter;
