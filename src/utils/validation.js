const validator = require('validator');

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req;
  if (!firstName.length) {
    throw new Error("Enter valid first name");
  }

  if (!validator.isEmail(emailId)) {
    throw new Error("Enter a valid Email");
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error("Enter Strong password");
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

module.exports = {
  validateSignUpData,
  validateLoginData,
};
