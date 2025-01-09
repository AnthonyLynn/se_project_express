const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { OK_CODE, CREATED_CODE, CONFLICT_CODE } = require("../utils/errors");
const checkError = require("../utils/checkError");
const { JWT_SECRET } = require("../utils/config");

function getUsers(req, res) {
  User.find({})
    .then((users) => res.status(OK_CODE).send({ data: users }))
    .catch((err) => {
      console.error(err);
      return checkError(err, res);
    });
}

function getCurrentUser(req, res) {
  const { _id } = req.user;

  User.findById(_id)
    .orFail()
    .then((user) => res.status(OK_CODE).send({ data: user }))
    .catch((err) => {
      console.error(err);
      return checkError(err, res);
    });
}

function createUser(req, res) {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        email,
        avatar,
        name,
        password: hash,
      })
    )
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      res.status(CREATED_CODE).send({ data: userObj });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === 11000) {
        return res
          .status(CONFLICT_CODE)
          .send({ message: "User with the same email already exists" });
      }
      return checkError(err, res);
    });
}

function login(req, res) {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        }),
      });
    })
    .catch((err) => {
      console.error(err);
      return checkError(err, res);
    });
}

function updateUser(req, res) {
  const { _id } = req.user;
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    _id,
    { name, avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail()
    .then((user) => res.status(OK_CODE).send({ data: user }))
    .catch((err) => {
      console.error(err);
      return checkError(err, res);
    });
}

module.exports = {
  getUsers,
  getCurrentUser,
  createUser,
  login,
  updateUser,
};
