const express = require("express");
const app = express();
const connectDB = require("./config/database");
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

const authRouter = require("./routes/auth");
const profileRouter= require("./routes/profile");
const connectionRouter = require("./routes/connection");

app.use('/',authRouter);
app.use('/', profileRouter);
app.use('/', connectionRouter);
