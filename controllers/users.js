const User = require("../models/user");
const { OK_CODE, CREATED_CODE } = require("../utils/errors");
const checkError = require("../utils/checkError");

function getUsers(req, res) {
  User.find({})
    .then((users) => res.status(OK_CODE).send({ data: users }))
    .catch((err) => {
      console.error(err);
      return checkError(err, res);
    });
}

function getUser(req, res) {
  const id = req.params.userId;

  User.findById(id)
    .orFail()
    .then((user) => res.status(OK_CODE).send({ data: user }))
    .catch((err) => {
      console.error(err);
      return checkError(err, res);
    });
}

function createUser(req, res) {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(CREATED_CODE).send({ data: user }))
    .catch((err) => {
      console.error(err);
      return checkError(err, res);
    });
}

module.exports = {
  getUsers,
  getUser,
  createUser,
};
