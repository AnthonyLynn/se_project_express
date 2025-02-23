const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const BadRequestError = require("../errors/bad-request-err");
const UnathorizedError = require("../errors/unathorized-err");

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

userSchema.statics.findUserByCredentials = function (email, password) {
  if (!email || !password) {
    return Promise.reject(new BadRequestError("Missing password or email"));
  }

  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(
          new UnathorizedError("Incorrect password or email")
        );
      }

      return bcrypt.compare(password, user.password).then((isMatched) => {
        if (!isMatched) {
          return Promise.reject(
            new UnathorizedError("Incorrect password or email")
          );
        }

        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
