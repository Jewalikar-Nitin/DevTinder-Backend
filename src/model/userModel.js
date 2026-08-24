const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema({
  firstName: {
    type: String,
    trim: true,
    required: true,
    index:true,
    minLength: 2,
    maxLength: 20
  },
  lastName: {
    type: String,
    trim: true,
  },
  emailID: {
    type: String,
    trim: true,
    unique:true,
    required: true,
    maxLength:50,
    lowercase:true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error("Invalid emild Id")
      }
    }

  },
  password: {
    type: String,
    maxLength:255,
    validate(value){
      if(!validator.isStrongPassword(value)){
        throw new Error('Please enter strong password');
      }
    }
  },
  gender: {
    type: String,
    validate(value){
      if(!['male','female','other'].includes(value)){
        throw new Error('Gender data is not valid');
      }
    }
  },
  age: {
    type: Number,
    min: 16,
  },
  skills: {
    type: [String],
  },
  about: {
    type: String,
    default:"This is default about user!!"
  },
  photoURL: {
    type: String,
    trim:true,
    validate(value){
      if(!validator.isURL(value)){
        throw new Error("Not a valid url")
      }
    }
  },
},{
  timestamp:true
});

userSchema.methods.getJWT = async function(){
  const user = this;
  const token = jwt.sign({_id:user._id},"User@3421$",{expiresIn:'1d'});
  return token;
}

userSchema.methods.validatePassword = async function(inputPasswordByUser){
  const user = this;
  const isValidPassword = await bcrypt.compare(inputPasswordByUser, user.password,);
  return isValidPassword;
}

const User = mongoose.model("User", userSchema);

module.exports = User;
