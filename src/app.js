const express = require("express");
const app = express();
const { adminAuth, userAuth } = require("./middlewares/auth");
const connectDB = require("./config/database");
const User = require("./model/userModel");
const { signupValidator, updateUserValidator } = require("./utils/validate");
const bcrypt = require("bcrypt");

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

app.post("/signup", async (req, res) => {
  try {
    signupValidator(req);
    const { firstName, lastName, emailID, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailID,
      password: hashedPassword,
    });
    await user.save();
    res.send("User saved successfully");
  } catch (err) {
    res.status(500).send("Internal server error!!" + err);
  }
});

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
