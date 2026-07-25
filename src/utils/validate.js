const validator = require("validator");

function signupValidator(req) {
  const { firstName, lastName, emailID, password } = req.body;

  if (!firstName) throw new Error("First name is required");

  if (firstName.lenght < 4 || firstName.lenght > 20) {
    throw new Error("FirstName must be between 4 to 20 characters");
  }

  if (!validator.isEmail(emailID)) {
    throw new Error("Enter a valid email address");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password");
  }
}

function updateUserValidator(req) {
  const ALLOWED_DATA = ["lastName", "skills", "photoURL", "about"];

  const isAllowed = Object.keys(data).every((k) => ALLOWED_DATA.includes(k));

  if (!isAllowed) throw new Error("Not allowed data");

  if (data.skills.length > 10) throw new Error("10 skills allwoed only");
}

module.exports = {signupValidator, updateUserValidator}