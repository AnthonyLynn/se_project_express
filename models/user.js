const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    required: true,
    type: String,
    validate: {
      validator: (value) => validator.isURL(value),
      message: "You must enter a valid URL",
    },
  },
  email: {
    required: true,
    type: String,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: "You must enter a vaild email",
    },
  },
  password: {
    required: true,
    type: String,
    select: false,
  },
});

const incorrectCredentialsError = new Error("Incorrect password or email");
incorrectCredentialsError.name = "IncorrectCredentailsError";

const missingCredentialsError = new Error("Missing password or email");
missingCredentialsError.name = "MissingCredentailsError";

userSchema.statics.findUserByCredentials = function (email, password) {
  if (!email || !password) {
    return Promise.reject(missingCredentialsError);
  }

  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(incorrectCredentialsError);
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(incorrectCredentialsError);
        }

        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
