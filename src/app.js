const express = require('express');
const app = express();
const {adminAuth , userAuth} = require("./middlewares/auth")
const connectDB = require('./config/database')
const User = require('./model/userModel')

connectDB()
  .then(() => {
    console.log("Connected DB successfully");
    app.listen(7777,()=>{
    console.log('server listening on port 7777.');
})
  })
  .catch((err) => {
    console.log(err);
  });
  

app.use(express.json());

app.use('/signup',async(req,res)=>{
  console.log('sign up', req.body)
    const user = new User(req.body);
    try{
      await user.save();
      res.send('User saved successfully');
    }catch(err){
      console.log(user);
      res.status(500).send('Internal server error!!')
    }
})
