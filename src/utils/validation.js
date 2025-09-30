const validator = require('validator');
const { OTP_LENGTH } = require('./constants');

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password, resend } = req;
  if (!firstName.length) {
    throw new Error("Enter valid first name");
  }

  if (!validator.isEmail(emailId)) {
    throw new Error("Enter a valid Email");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Enter Strong password");
  }

  if (typeof resend !== "boolean") {
  throw new Error("Invalid input: 'resend' must be a boolean (true or false). Do not modify this value.");
}
};

const validateLoginData = (req) =>{
    const { emailId, password } = req;
    if (!validator.isEmail(emailId)) {
        throw new Error("Enter a valid Email");
      }
      if (!validator.isStrongPassword(password)) {
        throw new Error("Not a valid password");
      }
}

const validateOtpData = (otp) =>{
  
  console.log("otp",otp);
  if(otp.length !== OTP_LENGTH){
    throw new Error("Invalid Opt length")
  }
}

const validatePassword = (password) =>{
  
  if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a valid strong password");
  }
  return true
}

const validateProfileEditData = (req) => {
  const AllowedEditFields = ["age", "gender", "photoUrl", "about", "skills"];
  const isEditAllowed = Object.keys(req).every((field) =>
    AllowedEditFields.includes(field)
  );
  if (!isEditAllowed) {
    throw new Error("Invalid edit request");
  }

  return isEditAllowed;
};

module.exports = {
  validateSignUpData,
  validateLoginData,
  validateProfileEditData,
  validatePassword,
  validateOtpData,
};
