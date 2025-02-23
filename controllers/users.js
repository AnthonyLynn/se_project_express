const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const BadRequestError = require("../errors/bad-request-err");
const ConflictError = require("../errors/conflict-err");
const UnauthorizedError = require("../errors/unathorized-err");
const { JWT_SECRET } = require("../utils/config");

function getCurrentUser(req, res, next) {
  const { _id } = req.user;

  User.findById(_id)
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch(next);
}

function createUser(req, res, next) {
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
      res.status(201).send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        }),
        user: userObj,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(
          new ConflictError("User with the same email already exists")
        );
      }
      if (err.name == "ValidationError") {
        return next(new BadRequestError(err.message));
      }
      next(err);
    });
}

function login(req, res, next) {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        }),
        user,
      });
    })
    .catch((err) => {
      if (err.name == "IncorrectCredentailsError") {
        return next(new UnauthorizedError(err.message));
      }
      if (err.name == "MissingCredentailsError") {
        return next(new BadRequestError(err.message));
      }
      next(err);
    });
}

function updateUser(req, res, next) {
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
    .then((user) => res.send({ data: user }))
    .catch(next);
}

module.exports = {
  getCurrentUser,
  createUser,
  login,
  updateUser,
};
